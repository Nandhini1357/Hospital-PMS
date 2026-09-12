package com.examly.springapp.service;

import com.examly.springapp.dto.InventoryBatchDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.DrugRepository;
import com.examly.springapp.repository.InventoryBatchRepository;
import com.examly.springapp.repository.InventoryRepository;
import com.examly.springapp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryBatchService {

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<InventoryBatchDTO> getAllBatches() {
        LocalDate today = LocalDate.now();
        List<InventoryBatch> batches = batchRepository.findAll();

        return mapBatchesToDTO(batches, today);
    }

    public List<InventoryBatchDTO> getBatchesByDrug(Long drugId) {
        LocalDate today = LocalDate.now();
        List<InventoryBatch> batches = batchRepository.findByDrugId(drugId);

        return mapBatchesToDTO(batches, today);
    }

    // FEFO: First Expire, First Out list of batches for a drug
    public List<InventoryBatchDTO> getFefoBatchesForDrug(Long drugId) {
        LocalDate today = LocalDate.now();
        List<InventoryBatch> batches = batchRepository
                .findByDrugIdAndQuantityGreaterThanAndExpiryDateAfterOrderByExpiryDateAsc(drugId, 0, today);

        return mapBatchesToDTO(batches, today);
    }

    public InventoryBatchDTO getBatchById(Long id) {
        InventoryBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory Batch not found with id: " + id));
        return mapToDTO(batch, LocalDate.now(), false);
    }

    public InventoryBatchDTO addBatch(InventoryBatchDTO dto) {
        validateBatchDates(dto.getManufacturingDate(), dto.getExpiryDate());

        Drug drug = drugRepository.findById(dto.getDrugId())
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + dto.getDrugId()));

        if (batchRepository.existsByDrugIdAndBatchNumberIgnoreCase(dto.getDrugId(), dto.getBatchNumber().trim())) {
            throw new DuplicateResourceException("Batch number '" + dto.getBatchNumber() + "' already exists for this drug");
        }

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId()).orElse(null);
        }

        InventoryBatch batch = new InventoryBatch(
                drug,
                supplier,
                dto.getBatchNumber().trim(),
                dto.getQuantity(),
                dto.getUnitPrice(),
                dto.getManufacturingDate(),
                dto.getExpiryDate()
        );

        InventoryBatch saved = batchRepository.save(batch);

        // Synchronize Inventory total quantity
        syncInventoryStock(drug.getId());

        return mapToDTO(saved, LocalDate.now(), false);
    }

    public InventoryBatchDTO updateBatch(Long id, InventoryBatchDTO dto) {
        validateBatchDates(dto.getManufacturingDate(), dto.getExpiryDate());

        InventoryBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory Batch not found with id: " + id));

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId()).orElse(null);
        }

        batch.setBatchNumber(dto.getBatchNumber().trim());
        batch.setQuantity(dto.getQuantity());
        batch.setUnitPrice(dto.getUnitPrice());
        batch.setManufacturingDate(dto.getManufacturingDate());
        batch.setExpiryDate(dto.getExpiryDate());
        batch.setSupplier(supplier);
        batch.updateStatus();

        InventoryBatch updated = batchRepository.save(batch);

        syncInventoryStock(batch.getDrug().getId());

        return mapToDTO(updated, LocalDate.now(), false);
    }

    public void deleteBatch(Long id) {
        InventoryBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory Batch not found with id: " + id));

        Long drugId = batch.getDrug().getId();
        batchRepository.delete(batch);

        syncInventoryStock(drugId);
    }

    public InventoryBatchDTO discardBatch(Long id) {
        InventoryBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory Batch not found with id: " + id));

        batch.setStatus(BatchStatus.DISCARDED);
        batch.setQuantity(0);
        InventoryBatch saved = batchRepository.save(batch);

        syncInventoryStock(batch.getDrug().getId());

        return mapToDTO(saved, LocalDate.now(), false);
    }

    private void validateBatchDates(LocalDate mfgDate, LocalDate expDate) {
        if (mfgDate != null && mfgDate.isAfter(LocalDate.now())) {
            throw new InvalidInventoryException("Manufacturing date cannot be in the future");
        }
        if (expDate != null && !expDate.isAfter(LocalDate.now())) {
            throw new InvalidInventoryException("Expiry date must be in the future");
        }
        if (mfgDate != null && expDate != null && expDate.isBefore(mfgDate)) {
            throw new InvalidInventoryException("Expiry date must be after manufacturing date");
        }
    }

    public void syncInventoryStock(Long drugId) {
        LocalDate today = LocalDate.now();
        Integer availableTotal = batchRepository.sumAvailableQuantityByDrugId(drugId, today);
        if (availableTotal == null) {
            availableTotal = 0;
        }

        Inventory inventory = inventoryRepository.findByDrugId(drugId).orElse(null);
        if (inventory != null) {
            inventory.setTotalQuantity(availableTotal);
            inventoryRepository.save(inventory);
        } else {
            Drug drug = drugRepository.findById(drugId).orElse(null);
            if (drug != null) {
                Inventory newInventory = new Inventory(drug, availableTotal, drug.getReorderLevel());
                inventoryRepository.save(newInventory);
            }
        }
    }

    private List<InventoryBatchDTO> mapBatchesToDTO(List<InventoryBatch> batches, LocalDate today) {
        // Find earliest expiring batch per drug to flag isNextToExpire
        Long nextToExpireId = batches.stream()
                .filter(b -> b.getExpiryDate().isAfter(today) && b.getQuantity() > 0 && b.getStatus() != BatchStatus.DISCARDED)
                .min((b1, b2) -> b1.getExpiryDate().compareTo(b2.getExpiryDate()))
                .map(InventoryBatch::getId)
                .orElse(null);

        return batches.stream()
                .map(b -> mapToDTO(b, today, b.getId().equals(nextToExpireId)))
                .collect(Collectors.toList());
    }

    public InventoryBatchDTO mapToDTO(InventoryBatch batch, LocalDate today, boolean isNextToExpire) {
        long daysToExpiry = ChronoUnit.DAYS.between(today, batch.getExpiryDate());

        return new InventoryBatchDTO(
                batch.getId(),
                batch.getDrug().getId(),
                batch.getDrug().getName(),
                batch.getDrug().getCode(),
                batch.getSupplier() != null ? batch.getSupplier().getId() : null,
                batch.getSupplier() != null ? batch.getSupplier().getName() : "N/A",
                batch.getBatchNumber(),
                batch.getQuantity(),
                batch.getUnitPrice(),
                batch.getManufacturingDate(),
                batch.getExpiryDate(),
                batch.getStatus(),
                daysToExpiry,
                isNextToExpire,
                batch.getCreatedAt()
        );
    }
}
