package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "grn_items")
public class GRNItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grn_id", nullable = false)
    @JsonIgnore
    private GoodsReceiptNote grn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "po_item_id")
    private PurchaseOrderItem poItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false)
    @NotNull(message = "Drug is required for GRN Item")
    private Drug drug;

    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @NotNull(message = "Received quantity is required")
    @Min(value = 0, message = "Received quantity cannot be negative")
    @Column(name = "received_quantity", nullable = false)
    private Integer receivedQuantity;

    @Column(name = "accepted_quantity")
    private Integer acceptedQuantity = 0;

    @Column(name = "rejected_quantity")
    private Integer rejectedQuantity = 0;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "inspection_status", length = 20)
    private InspectionResult inspectionStatus;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public GRNItem() {}

    public GRNItem(PurchaseOrderItem poItem, Drug drug, String batchNumber, LocalDate expiryDate, Integer receivedQuantity, BigDecimal unitPrice) {
        this.poItem = poItem;
        this.drug = drug;
        this.batchNumber = batchNumber;
        this.expiryDate = expiryDate;
        this.receivedQuantity = receivedQuantity;
        this.unitPrice = unitPrice != null ? unitPrice : BigDecimal.ZERO;
        this.acceptedQuantity = 0;
        this.rejectedQuantity = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GoodsReceiptNote getGrn() { return grn; }
    public void setGrn(GoodsReceiptNote grn) { this.grn = grn; }

    public PurchaseOrderItem getPoItem() { return poItem; }
    public void setPoItem(PurchaseOrderItem poItem) { this.poItem = poItem; }

    public Drug getDrug() { return drug; }
    public void setDrug(Drug drug) { this.drug = drug; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }

    public Integer getAcceptedQuantity() { return acceptedQuantity; }
    public void setAcceptedQuantity(Integer acceptedQuantity) { this.acceptedQuantity = acceptedQuantity; }

    public Integer getRejectedQuantity() { return rejectedQuantity; }
    public void setRejectedQuantity(Integer rejectedQuantity) { this.rejectedQuantity = rejectedQuantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public InspectionResult getInspectionStatus() { return inspectionStatus; }
    public void setInspectionStatus(InspectionResult inspectionStatus) { this.inspectionStatus = inspectionStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
