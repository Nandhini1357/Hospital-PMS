package com.examly.springapp.service;

import com.examly.springapp.dto.AutoPODraftSuggestionDTO;
import com.examly.springapp.dto.PurchaseOrderDTO;
import com.examly.springapp.dto.PurchaseOrderItemDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PurchaseOrderDTO> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<PurchaseOrderDTO> getPurchaseOrdersByStatus(POStatus status) {
        return purchaseOrderRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PurchaseOrderDTO getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + id));
        return mapToDTO(po);
    }

    public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderDTO dto, User createdBy) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));

        String poNumber = "PO-" + LocalDate.now().getYear() + "-" + String.format("%04d", System.currentTimeMillis() % 10000);

        PurchaseOrder po = new PurchaseOrder(
                poNumber,
                supplier,
                dto.getExpectedDeliveryDate() != null ? dto.getExpectedDeliveryDate() : LocalDate.now().plusDays(7),
                dto.getStatus() != null ? dto.getStatus() : POStatus.DRAFT,
                dto.getNotes(),
                createdBy
        );

        if (dto.getItems() != null) {
            for (PurchaseOrderItemDTO itemDto : dto.getItems()) {
                Drug drug = drugRepository.findById(itemDto.getDrugId())
                        .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + itemDto.getDrugId()));

                BigDecimal price = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.valueOf(50);
                PurchaseOrderItem item = new PurchaseOrderItem(drug, itemDto.getQuantity(), price);
                po.addItem(item);
            }
        }

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return mapToDTO(saved);
    }

    public PurchaseOrderDTO updatePurchaseOrder(Long id, PurchaseOrderDTO dto) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + id));

        if (po.getStatus() == POStatus.RECEIVED || po.getStatus() == POStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update Purchase Order in " + po.getStatus() + " status");
        }

        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));
            po.setSupplier(supplier);
        }

        if (dto.getExpectedDeliveryDate() != null) {
            po.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        }

        if (dto.getNotes() != null) {
            po.setNotes(dto.getNotes());
        }

        if (dto.getStatus() != null) {
            po.setStatus(dto.getStatus());
        }

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            po.getItems().clear();
            for (PurchaseOrderItemDTO itemDto : dto.getItems()) {
                Drug drug = drugRepository.findById(itemDto.getDrugId())
                        .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + itemDto.getDrugId()));

                BigDecimal price = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.valueOf(50);
                PurchaseOrderItem item = new PurchaseOrderItem(drug, itemDto.getQuantity(), price);
                po.addItem(item);
            }
        }

        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return mapToDTO(updated);
    }

    public PurchaseOrderDTO updateStatus(Long id, POStatus status) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + id));
        po.setStatus(status);
        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return mapToDTO(updated);
    }

    public void deletePurchaseOrder(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + id));
        purchaseOrderRepository.delete(po);
    }

    public List<AutoPODraftSuggestionDTO> getAutoDraftSuggestions() {
        List<Inventory> lowStockInventories = inventoryRepository.findAll().stream()
                .filter(inv -> inv.getTotalQuantity() <= inv.getReorderLevel())
                .collect(Collectors.toList());

        List<Supplier> activeSuppliers = supplierRepository.findByIsActiveTrue();
        Supplier defaultSupplier = activeSuppliers.isEmpty() ? null : activeSuppliers.get(0);

        List<AutoPODraftSuggestionDTO> suggestions = new ArrayList<>();
        for (Inventory inv : lowStockInventories) {
            Drug drug = inv.getDrug();
            int currentStock = inv.getTotalQuantity();
            int reorderLevel = inv.getReorderLevel();
            int suggestedQty = Math.max((reorderLevel * 2) - currentStock, 1);

            suggestions.add(new AutoPODraftSuggestionDTO(
                    drug.getId(),
                    drug.getName(),
                    drug.getCode(),
                    drug.getCategory() != null ? drug.getCategory().getName() : "General",
                    currentStock,
                    reorderLevel,
                    suggestedQty,
                    defaultSupplier != null ? defaultSupplier.getId() : null,
                    defaultSupplier != null ? defaultSupplier.getName() : "Select Supplier",
                    BigDecimal.valueOf(45.00)
            ));
        }

        return suggestions;
    }

    public PurchaseOrderDTO mapToDTO(PurchaseOrder po) {
        List<PurchaseOrderItemDTO> itemDtos = po.getItems() != null ? po.getItems().stream()
                .map(i -> new PurchaseOrderItemDTO(
                        i.getId(),
                        i.getDrug() != null ? i.getDrug().getId() : null,
                        i.getDrug() != null ? i.getDrug().getName() : null,
                        i.getDrug() != null ? i.getDrug().getCode() : null,
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getTotalPrice()
                ))
                .collect(Collectors.toList()) : new ArrayList<>();

        return new PurchaseOrderDTO(
                po.getId(),
                po.getPoNumber(),
                po.getSupplier() != null ? po.getSupplier().getId() : null,
                po.getSupplier() != null ? po.getSupplier().getName() : null,
                po.getOrderDate(),
                po.getExpectedDeliveryDate(),
                po.getStatus(),
                po.getTotalAmount(),
                po.getNotes(),
                po.getCreatedBy() != null ? po.getCreatedBy().getId() : null,
                po.getCreatedBy() != null ? po.getCreatedBy().getFullName() : null,
                itemDtos,
                po.getCreatedAt(),
                po.getUpdatedAt()
        );
    }
}
