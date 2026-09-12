package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_batches")
public class InventoryBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false)
    @NotNull(message = "Drug is required for batch")
    private Drug drug;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @NotBlank(message = "Batch number is required")
    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @NotNull(message = "Manufacturing date is required")
    @Column(name = "manufacturing_date", nullable = false)
    private LocalDate manufacturingDate;

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BatchStatus status = BatchStatus.AVAILABLE;

    @Column(length = 150)
    private String manufacturer;

    @Column(name = "supplier_invoice", length = 100)
    private String supplierInvoice;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public InventoryBatch() {
        this.createdAt = LocalDateTime.now();
    }

    public InventoryBatch(Drug drug, Supplier supplier, String batchNumber, Integer quantity, BigDecimal unitPrice, LocalDate manufacturingDate, LocalDate expiryDate) {
        this.drug = drug;
        this.supplier = supplier;
        this.batchNumber = batchNumber;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.manufacturingDate = manufacturingDate;
        this.expiryDate = expiryDate;
        this.createdAt = LocalDateTime.now();
        this.updateStatus();
    }

    public InventoryBatch(Drug drug, String batchNumber, Integer quantity, LocalDate expiryDate, String manufacturer, String supplierInvoice) {
        this.drug = drug;
        this.batchNumber = batchNumber;
        this.quantity = quantity;
        this.unitPrice = BigDecimal.ZERO;
        this.manufacturingDate = LocalDate.now();
        this.expiryDate = expiryDate;
        this.manufacturer = manufacturer;
        this.supplierInvoice = supplierInvoice;
        this.createdAt = LocalDateTime.now();
        this.updateStatus();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        updateStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        updateStatus();
    }

    public void updateStatus() {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            this.status = BatchStatus.EXPIRED;
        } else if (quantity != null && quantity == 0) {
            this.status = BatchStatus.LOW_STOCK;
        } else if (this.status != BatchStatus.DISCARDED) {
            this.status = BatchStatus.AVAILABLE;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Drug getDrug() {
        return drug;
    }

    public void setDrug(Drug drug) {
        this.drug = drug;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        updateStatus();
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDate getManufacturingDate() {
        return manufacturingDate;
    }

    public void setManufacturingDate(LocalDate manufacturingDate) {
        this.manufacturingDate = manufacturingDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
        updateStatus();
    }

    public BatchStatus getStatus() {
        return status;
    }

    public void setStatus(BatchStatus status) {
        this.status = status;
    }

    public String getManufacturer() {
        if (manufacturer != null && !manufacturer.trim().isEmpty()) {
            return manufacturer;
        }
        return supplier != null ? supplier.getName() : "Standard Pharma";
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getSupplierInvoice() {
        if (supplierInvoice != null && !supplierInvoice.trim().isEmpty()) {
            return supplierInvoice;
        }
        return "INV-STD-" + id;
    }

    public void setSupplierInvoice(String supplierInvoice) {
        this.supplierInvoice = supplierInvoice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
