package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class NarcoticsReconciliationRequestDTO {

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    private String batchNo;

    @NotNull(message = "Physical closing balance is required")
    @Min(value = 0, message = "Physical closing balance cannot be negative")
    private Integer physicalClosingBalance;

    private String varianceReason;

    @NotNull(message = "Pharmacist ID is required")
    private Long pharmacistId;

    private String digitalSig;

    public NarcoticsReconciliationRequestDTO() {}

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

    public Integer getPhysicalClosingBalance() {
        return physicalClosingBalance;
    }

    public void setPhysicalClosingBalance(Integer physicalClosingBalance) {
        this.physicalClosingBalance = physicalClosingBalance;
    }

    public String getVarianceReason() {
        return varianceReason;
    }

    public void setVarianceReason(String varianceReason) {
        this.varianceReason = varianceReason;
    }

    public Long getPharmacistId() {
        return pharmacistId;
    }

    public void setPharmacistId(Long pharmacistId) {
        this.pharmacistId = pharmacistId;
    }

    public String getDigitalSig() {
        return digitalSig;
    }

    public void setDigitalSig(String digitalSig) {
        this.digitalSig = digitalSig;
    }
}
