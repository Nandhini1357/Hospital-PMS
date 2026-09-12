package com.examly.springapp.dto;

import com.examly.springapp.model.BatchStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InventoryBatchDTO {
    private Long id;

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    private String drugName;
    private String drugCode;

    private Long supplierId;
    private String supplierName;

    @NotBlank(message = "Batch number is required")
    private String batchNumber;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    @NotNull(message = "Manufacturing date is required")
    private LocalDate manufacturingDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private BatchStatus status;
    private Long daysToExpiry;
    private Boolean isNextToExpire;
    private LocalDateTime createdAt;

    public InventoryBatchDTO() {}

    public InventoryBatchDTO(Long id, Long drugId, String drugName, String drugCode, Long supplierId, String supplierName, String batchNumber, Integer quantity, BigDecimal unitPrice, LocalDate manufacturingDate, LocalDate expiryDate, BatchStatus status, Long daysToExpiry, Boolean isNextToExpire, LocalDateTime createdAt) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.batchNumber = batchNumber;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.manufacturingDate = manufacturingDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.daysToExpiry = daysToExpiry;
        this.isNextToExpire = isNextToExpire;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDrugId() {
        return drugId;
    }

    public void setDrugId(Long drugId) {
        this.drugId = drugId;
    }

    public String getDrugName() {
        return drugName;
    }

    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    public String getDrugCode() {
        return drugCode;
    }

    public void setDrugCode(String drugCode) {
        this.drugCode = drugCode;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
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
    }

    public BatchStatus getStatus() {
        return status;
    }

    public void setStatus(BatchStatus status) {
        this.status = status;
    }

    public Long getDaysToExpiry() {
        return daysToExpiry;
    }

    public void setDaysToExpiry(Long daysToExpiry) {
        this.daysToExpiry = daysToExpiry;
    }

    public Boolean getIsNextToExpire() {
        return isNextToExpire;
    }

    public void setIsNextToExpire(Boolean isNextToExpire) {
        this.isNextToExpire = isNextToExpire;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
