package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class NarcoticsDispenseRequestDTO {

    @NotNull(message = "Prescription ID is required")
    private Long prescriptionId;

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    private String batchNo;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Primary pharmacist ID is required")
    private Long primaryPharmacistId;

    private String primaryPassword;
    private String primaryDigitalSig;

    private Long secondaryPharmacistId;
    private String secondaryPassword;
    private String secondaryDigitalSig;

    private Boolean isEmergencyOverride = false;
    private String emergencyReason;

    public NarcoticsDispenseRequestDTO() {}

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

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

    public Long getPrimaryPharmacistId() {
        return primaryPharmacistId;
    }

    public void setPrimaryPharmacistId(Long primaryPharmacistId) {
        this.primaryPharmacistId = primaryPharmacistId;
    }

    public String getPrimaryPassword() {
        return primaryPassword;
    }

    public void setPrimaryPassword(String primaryPassword) {
        this.primaryPassword = primaryPassword;
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

    public String getSecondaryPassword() {
        return secondaryPassword;
    }

    public void setSecondaryPassword(String secondaryPassword) {
        this.secondaryPassword = secondaryPassword;
    }

    public String getSecondaryDigitalSig() {
        return secondaryDigitalSig;
    }

    public void setSecondaryDigitalSig(String secondaryDigitalSig) {
        this.secondaryDigitalSig = secondaryDigitalSig;
    }

    public Boolean getIsEmergencyOverride() {
        return isEmergencyOverride != null ? isEmergencyOverride : false;
    }

    public void setIsEmergencyOverride(Boolean isEmergencyOverride) {
        this.isEmergencyOverride = isEmergencyOverride;
    }

    public String getEmergencyReason() {
        return emergencyReason;
    }

    public void setEmergencyReason(String emergencyReason) {
        this.emergencyReason = emergencyReason;
    }
}
