package com.examly.springapp.service;

import com.examly.springapp.dto.GRNDTO;
import com.examly.springapp.dto.GRNItemDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GRNService {

    @Autowired
    private GoodsReceiptNoteRepository grnRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private DrugRepository drugRepository;

    public List<GRNDTO> getAllGRNs() {
        return grnRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GRNDTO getGRNById(Long id) {
        GoodsReceiptNote grn = grnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + id));
        return mapToDTO(grn);
    }

    public List<GRNDTO> getGRNsByPO(Long purchaseOrderId) {
        return grnRepository.findByPurchaseOrderId(purchaseOrderId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GRNDTO createGRN(GRNDTO dto, User receivedBy) {
        PurchaseOrder po = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with id: " + dto.getPurchaseOrderId()));

        Supplier supplier = po.getSupplier();
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));
        }

        String grnNumber = "GRN-" + LocalDate.now().getYear() + "-" + String.format("%04d", System.currentTimeMillis() % 10000);

        GoodsReceiptNote grn = new GoodsReceiptNote(
                grnNumber,
                po,
                supplier,
                dto.getInvoiceNumber(),
                dto.getReceivedDate() != null ? dto.getReceivedDate() : LocalDate.now(),
                receivedBy,
                dto.getNotes()
        );

        if (dto.getItems() != null) {
            for (GRNItemDTO itemDto : dto.getItems()) {
                Drug drug = drugRepository.findById(itemDto.getDrugId())
                        .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + itemDto.getDrugId()));

                PurchaseOrderItem poItem = null;
                if (itemDto.getPoItemId() != null) {
                    poItem = po.getItems().stream()
                            .filter(i -> i.getId().equals(itemDto.getPoItemId()))
                            .findFirst().orElse(null);
                }

                String batchNo = (itemDto.getBatchNumber() != null && !itemDto.getBatchNumber().trim().isEmpty())
                        ? itemDto.getBatchNumber().trim()
                        : "BATCH-" + System.currentTimeMillis() % 10000;

                LocalDate expDate = itemDto.getExpiryDate() != null ? itemDto.getExpiryDate() : LocalDate.now().plusYears(2);

                GRNItem item = new GRNItem(
                        poItem,
                        drug,
                        batchNo,
                        expDate,
                        itemDto.getReceivedQuantity(),
                        itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : (poItem != null ? poItem.getUnitPrice() : null)
                );
                grn.addItem(item);
            }
        }

        GoodsReceiptNote saved = grnRepository.save(grn);
        return mapToDTO(saved);
    }

    public GRNDTO mapToDTO(GoodsReceiptNote grn) {
        List<GRNItemDTO> itemDtos = grn.getItems() != null ? grn.getItems().stream()
                .map(i -> new GRNItemDTO(
                        i.getId(),
                        i.getPoItem() != null ? i.getPoItem().getId() : null,
                        i.getDrug() != null ? i.getDrug().getId() : null,
                        i.getDrug() != null ? i.getDrug().getName() : null,
                        i.getDrug() != null ? i.getDrug().getCode() : null,
                        i.getBatchNumber(),
                        i.getExpiryDate(),
                        i.getReceivedQuantity(),
                        i.getAcceptedQuantity(),
                        i.getRejectedQuantity(),
                        i.getUnitPrice(),
                        i.getInspectionStatus(),
                        i.getRejectionReason()
                ))
                .collect(Collectors.toList()) : new ArrayList<>();

        return new GRNDTO(
                grn.getId(),
                grn.getGrnNumber(),
                grn.getPurchaseOrder() != null ? grn.getPurchaseOrder().getId() : null,
                grn.getPurchaseOrder() != null ? grn.getPurchaseOrder().getPoNumber() : null,
                grn.getSupplier() != null ? grn.getSupplier().getId() : null,
                grn.getSupplier() != null ? grn.getSupplier().getName() : null,
                grn.getInvoiceNumber(),
                grn.getReceivedDate(),
                grn.getReceivedBy() != null ? grn.getReceivedBy().getId() : null,
                grn.getReceivedBy() != null ? grn.getReceivedBy().getFullName() : null,
                grn.getStatus(),
                grn.getNotes(),
                itemDtos,
                grn.getCreatedAt()
        );
    }
}
