package com.examly.springapp.service;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private DrugCategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private DrugService drugService;

    @Autowired
    private InventoryBatchService batchService;

    public List<InventoryDTO> getInventorySummary() {
        LocalDate today = LocalDate.now();
        List<Drug> drugs = drugRepository.findAll();

        return drugs.stream().map(drug -> {
            Integer totalStock = batchRepository.sumAvailableQuantityByDrugId(drug.getId(), today);
            if (totalStock == null) totalStock = 0;

            List<InventoryBatch> batches = batchRepository.findByDrugId(drug.getId());
            int batchCount = (int) batches.stream()
                    .filter(b -> b.getExpiryDate().isAfter(today) && b.getQuantity() > 0 && b.getStatus() != BatchStatus.DISCARDED)
                    .count();

            boolean isLowStock = totalStock <= drug.getReorderLevel();

            Inventory inventory = inventoryRepository.findByDrugId(drug.getId()).orElse(null);

            return new InventoryDTO(
                    inventory != null ? inventory.getId() : null,
                    drug.getId(),
                    drug.getName(),
                    drug.getCode(),
                    drug.getCategory().getName(),
                    drug.getUnit(),
                    totalStock,
                    drug.getReorderLevel(),
                    isLowStock,
                    batchCount,
                    inventory != null ? inventory.getLastUpdated() : drug.getUpdatedAt()
            );
        }).collect(Collectors.toList());
    }

    public List<DrugDTO> getLowStockAlerts() {
        LocalDate today = LocalDate.now();
        List<Drug> allDrugs = drugRepository.findAll();

        return allDrugs.stream()
                .filter(drug -> {
                    Integer totalStock = batchRepository.sumAvailableQuantityByDrugId(drug.getId(), today);
                    if (totalStock == null) totalStock = 0;
                    return totalStock <= drug.getReorderLevel();
                })
                .map(drugService::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryBatchDTO> getExpiryAlerts(Integer days) {
        LocalDate today = LocalDate.now();
        int alertDays = (days != null && days > 0) ? days : 60;
        LocalDate targetDate = today.plusDays(alertDays);

        List<InventoryBatch> batches = batchRepository.findExpiringSoonBatches(today, targetDate);
        return batches.stream()
                .map(b -> batchService.mapToDTO(b, today, false))
                .sorted(Comparator.comparing(InventoryBatchDTO::getExpiryDate))
                .collect(Collectors.toList());
    }

    public List<InventoryBatchDTO> getExpiredBatches() {
        LocalDate today = LocalDate.now();
        List<InventoryBatch> batches = batchRepository.findExpiredBatches(today);
        return batches.stream()
                .map(b -> batchService.mapToDTO(b, today, false))
                .sorted(Comparator.comparing(InventoryBatchDTO::getExpiryDate))
                .collect(Collectors.toList());
    }

    // FEFO Deduction Logic: Deduct requested quantity from batches ordered by earliest expiry date
    public void deductStockFEFO(StockDeductionRequest request) {
        Long drugId = request.getDrugId();
        int remainingToDeduct = request.getQuantity();
        LocalDate today = LocalDate.now();

        Drug drug = drugRepository.findById(drugId)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + drugId));

        List<InventoryBatch> availableBatches = batchRepository
                .findByDrugIdAndQuantityGreaterThanAndExpiryDateAfterOrderByExpiryDateAsc(drugId, 0, today);

        int totalAvailable = availableBatches.stream().mapToInt(InventoryBatch::getQuantity).sum();
        if (totalAvailable < remainingToDeduct) {
            throw new InvalidInventoryException("Insufficient unexpired stock for drug '" + drug.getName() + "'. Required: " + remainingToDeduct + ", Available: " + totalAvailable);
        }

        for (InventoryBatch batch : availableBatches) {
            if (remainingToDeduct <= 0) break;

            int currentQty = batch.getQuantity();
            if (currentQty >= remainingToDeduct) {
                batch.setQuantity(currentQty - remainingToDeduct);
                remainingToDeduct = 0;
            } else {
                remainingToDeduct -= currentQty;
                batch.setQuantity(0);
            }
            batchRepository.save(batch);
        }

        batchService.syncInventoryStock(drugId);
    }

    public InventoryDashboardDTO getDashboardData() {
        LocalDate today = LocalDate.now();
        InventoryDashboardDTO dto = new InventoryDashboardDTO();

        long totalDrugs = drugRepository.count();
        long totalCategories = categoryRepository.count();
        long totalSuppliers = supplierRepository.count();
        long totalBatches = batchRepository.count();

        List<DrugDTO> lowStockDrugs = getLowStockAlerts();
        List<InventoryBatchDTO> expiringSoonBatches = getExpiryAlerts(60);
        List<InventoryBatchDTO> expiredBatches = getExpiredBatches();

        Double totalValue = batchRepository.calculateTotalInventoryValue(today);
        BigDecimal val = totalValue != null ? BigDecimal.valueOf(totalValue) : BigDecimal.ZERO;

        Long sumQuantity = inventoryRepository.sumTotalStockQuantity();
        long totalStockQty = sumQuantity != null ? sumQuantity : 0;

        Map<String, Long> categoryBreakdown = new HashMap<>();
        List<Object[]> counts = drugRepository.countDrugsByCategory();
        for (Object[] row : counts) {
            categoryBreakdown.put((String) row[0], (Long) row[1]);
        }

        dto.setTotalDrugs(totalDrugs);
        dto.setTotalCategories(totalCategories);
        dto.setTotalSuppliers(totalSuppliers);
        dto.setTotalBatches(totalBatches);
        dto.setTotalStockQuantity(totalStockQty);
        dto.setLowStockDrugCount(lowStockDrugs.size());
        dto.setExpiringSoonBatchCount(expiringSoonBatches.size());
        dto.setExpiredBatchCount(expiredBatches.size());
        dto.setTotalInventoryValue(val);

        dto.setLowStockDrugs(lowStockDrugs);
        dto.setExpiringBatches(expiringSoonBatches);
        dto.setCategoryBreakdown(categoryBreakdown);

        return dto;
    }
}
