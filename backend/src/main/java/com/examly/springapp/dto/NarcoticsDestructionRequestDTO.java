package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NarcoticsDestructionRequestDTO {

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    @NotBlank(message = "Batch number is required")
    private String batchNo;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Witness name is required")
    private String witnessName;

    @NotBlank(message = "Destruction method is required")
    private String destructionMethod;

    @NotNull(message = "Primary pharmacist ID is required")
    private Long primaryPharmacistId;
    private String primaryDigitalSig;

    private Long secondaryPharmacistId;
    private String secondaryDigitalSig;

    public NarcoticsDestructionRequestDTO() {}

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

    public String getWitnessName() {
        return witnessName;
    }

    public void setWitnessName(String witnessName) {
        this.witnessName = witnessName;
    }

    public String getDestructionMethod() {
        return destructionMethod;
    }

    public void setDestructionMethod(String destructionMethod) {
        this.destructionMethod = destructionMethod;
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
