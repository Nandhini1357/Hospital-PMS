package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class NarcoticsReceiptRequestDTO {

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    @NotBlank(message = "Batch number is required")
    private String batchNo;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String manufacturer;
    private String supplierInvoice;
    private LocalDate expiryDate;

    @NotNull(message = "Primary pharmacist ID is required")
    private Long primaryPharmacistId;
    private String primaryDigitalSig;

    private Long secondaryPharmacistId;
    private String secondaryDigitalSig;

    public NarcoticsReceiptRequestDTO() {}

    public Long getDrugId() {
        return drugId;
    }

    public void setDrugId(Long drugId) {
        this.drugId = drugId;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getSupplierInvoice() {
        return supplierInvoice;
    }

    public void setSupplierInvoice(String supplierInvoice) {
        this.supplierInvoice = supplierInvoice;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Long getPrimaryPharmacistId() {
        return primaryPharmacistId;
    }

    public void setPrimaryPharmacistId(Long primaryPharmacistId) {
        this.primaryPharmacistId = primaryPharmacistId;
    }

    public String getPrimaryDigitalSig() {
        return primaryDigitalSig;
    }

    public void setPrimaryDigitalSig(String primaryDigitalSig) {
        this.primaryDigitalSig = primaryDigitalSig;
    }

    public Long getSecondaryPharmacistId() {
        return secondaryPharmacistId;
    }

    public void setSecondaryPharmacistId(Long secondaryPharmacistId) {
        this.secondaryPharmacistId = secondaryPharmacistId;
    }

    public String getSecondaryDigitalSig() {
        return secondaryDigitalSig;
    }

    public void setSecondaryDigitalSig(String secondaryDigitalSig) {
        this.secondaryDigitalSig = secondaryDigitalSig;
    }
}
