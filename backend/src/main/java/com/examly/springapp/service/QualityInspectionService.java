package com.examly.springapp.service;

import com.examly.springapp.dto.QualityInspectionDTO;
import com.examly.springapp.dto.QualityInspectionRequestDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QualityInspectionService {

    @Autowired
    private QualityInspectionRepository qualityInspectionRepository;

    @Autowired
    private GoodsReceiptNoteRepository grnRepository;

    @Autowired
    private GRNItemRepository grnItemRepository;

    @Autowired
    private InventoryBatchRepository inventoryBatchRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SecurityAuditLogRepository auditLogRepository;

    public List<QualityInspectionDTO> getAllInspections() {
        return qualityInspectionRepository.findAllByOrderByInspectionDateDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public QualityInspectionDTO getInspectionByGrnId(Long grnId) {
        QualityInspection qi = qualityInspectionRepository.findByGrnId(grnId)
                .orElseThrow(() -> new ResourceNotFoundException("Quality inspection not found for GRN ID: " + grnId));
        return mapToDTO(qi);
    }

    public QualityInspectionDTO performQualityInspection(QualityInspectionRequestDTO request, User inspector) {
        GoodsReceiptNote grn = grnRepository.findById(request.getGrnId())
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + request.getGrnId()));

        if (grn.getStatus() == GRNStatus.ACCEPTED || grn.getStatus() == GRNStatus.REJECTED) {
            throw new IllegalStateException("GRN has already been inspected and finalized.");
        }

        InspectionResult overallResult = request.getResult() != null ? request.getResult() : InspectionResult.PASSED;

        if (request.getItemInspections() != null) {
            for (QualityInspectionRequestDTO.ItemInspectionDetail detail : request.getItemInspections()) {
                GRNItem item = grnItemRepository.findById(detail.getGrnItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("GRN item not found with id: " + detail.getGrnItemId()));

                int acceptedQty = detail.getAcceptedQuantity() != null ? detail.getAcceptedQuantity() : item.getReceivedQuantity();
                int rejectedQty = detail.getRejectedQuantity() != null ? detail.getRejectedQuantity() : (item.getReceivedQuantity() - acceptedQty);

                item.setAcceptedQuantity(acceptedQty);
                item.setRejectedQuantity(rejectedQty);
                item.setRejectionReason(detail.getRejectionReason());

                if (rejectedQty == 0) {
                    item.setInspectionStatus(InspectionResult.PASSED);
                } else if (acceptedQty == 0) {
                    item.setInspectionStatus(InspectionResult.FAILED);
                } else {
                    item.setInspectionStatus(InspectionResult.PARTIALLY_PASSED);
                }

                grnItemRepository.save(item);

                // Inventory Update: ONLY add ACCEPTED quantity to usable stock!
                if (acceptedQty > 0) {
                    Drug drug = item.getDrug();
                    Supplier supplier = grn.getSupplier();
                    String batchNo = item.getBatchNumber();
                    LocalDate expDate = item.getExpiryDate() != null ? item.getExpiryDate() : LocalDate.now().plusYears(2);
                    BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.valueOf(50);

                    // 1. Check or create InventoryBatch
                    List<InventoryBatch> existingBatches = inventoryBatchRepository.findByDrugIdAndBatchNumber(drug.getId(), batchNo);
                    if (!existingBatches.isEmpty()) {
                        InventoryBatch existingBatch = existingBatches.get(0);
                        existingBatch.setQuantity(existingBatch.getQuantity() + acceptedQty);
                        inventoryBatchRepository.save(existingBatch);
                    } else {
                        InventoryBatch newBatch = new InventoryBatch(
                                drug,
                                supplier,
                                batchNo,
                                acceptedQty,
                                unitPrice,
                                LocalDate.now(),
                                expDate
                        );
                        newBatch.setManufacturer(supplier != null ? supplier.getName() : "Standard Pharma");
                        newBatch.setSupplierInvoice(grn.getInvoiceNumber() != null ? grn.getInvoiceNumber() : "GRN-" + grn.getId());
                        inventoryBatchRepository.save(newBatch);
                    }

                    // 2. Update Inventory Total Stock
                    Optional<Inventory> existingInvOpt = inventoryRepository.findByDrugId(drug.getId());
                    if (existingInvOpt.isPresent()) {
                        Inventory inv = existingInvOpt.get();
                        inv.setTotalQuantity(inv.getTotalQuantity() + acceptedQty);
                        inventoryRepository.save(inv);
                    } else {
                        Inventory newInv = new Inventory(drug, acceptedQty, drug.getReorderLevel());
                        inventoryRepository.save(newInv);
                    }
                }
            }
        }

        // Update GRN status
        if (overallResult == InspectionResult.PASSED || overallResult == InspectionResult.PARTIALLY_PASSED) {
            grn.setStatus(GRNStatus.ACCEPTED);
        } else {
            grn.setStatus(GRNStatus.REJECTED);
        }
        grnRepository.save(grn);

        // Update PO status to RECEIVED
        PurchaseOrder po = grn.getPurchaseOrder();
        if (po != null) {
            po.setStatus(POStatus.RECEIVED);
            purchaseOrderRepository.save(po);
        }

        QualityInspection qi = new QualityInspection(
                grn,
                inspector,
                overallResult,
                request.getRemarks()
        );
        QualityInspection saved = qualityInspectionRepository.save(qi);

        // Audit Logging
        auditLogRepository.save(new SecurityAuditLog(
                inspector != null ? inspector.getId() : null,
                inspector != null ? inspector.getEmail() : "SYSTEM",
                "QUALITY_INSPECTION_COMPLETED",
                "GRN #" + grn.getGrnNumber() + " inspected with result: " + overallResult,
                "INTERNAL"
        ));

        return mapToDTO(saved);
    }

    public QualityInspectionDTO mapToDTO(QualityInspection qi) {
        return new QualityInspectionDTO(
                qi.getId(),
                qi.getGrn() != null ? qi.getGrn().getId() : null,
                qi.getGrn() != null ? qi.getGrn().getGrnNumber() : null,
                qi.getInspectedBy() != null ? qi.getInspectedBy().getId() : null,
                qi.getInspectedBy() != null ? qi.getInspectedBy().getFullName() : null,
                qi.getInspectionDate(),
                qi.getStatus(),
                qi.getRemarks(),
                qi.getCreatedAt()
        );
    }
}
