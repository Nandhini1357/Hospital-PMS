package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class NarcoticsRegisterDTO {

    private Long id;
    private Long drugId;
    private String drugName;
    private String drugCode;
    private Boolean isScheduleH1;
    private Boolean isNarcotic;
    private String batchNo;
    private Long prescriptionId;
    private String prescriptionNumber;
    private Integer quantity;
    private String transactionType;
    private Long primaryPharmacistId;
    private String primaryPharmacistName;
    private Long secondaryPharmacistId;
    private String secondaryPharmacistName;
    private String primaryDigitalSigMasked;
    private String secondaryDigitalSigMasked;
    private Integer openingBalance;
    private Integer closingBalance;
    private LocalDateTime timestamp;
    private String witnessName;
    private String destructionMethod;
    private String manufacturer;
    private String supplierInvoice;
    private String doctorName;
    private String patientName;
    private Boolean isEmergencyOverride;
    private Boolean retrospectiveApproved;
    private String retrospectiveApprovedByName;
    private LocalDateTime retrospectiveApprovedAt;
    private String varianceReason;
    private String verificationHash;

    public NarcoticsRegisterDTO() {}

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

    public Boolean getIsScheduleH1() {
        return isScheduleH1;
    }

    public void setIsScheduleH1(Boolean isScheduleH1) {
        this.isScheduleH1 = isScheduleH1;
    }

    public Boolean getIsNarcotic() {
        return isNarcotic;
    }

    public void setIsNarcotic(Boolean isNarcotic) {
        this.isNarcotic = isNarcotic;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getPrescriptionNumber() {
        return prescriptionNumber;
    }

    public void setPrescriptionNumber(String prescriptionNumber) {
        this.prescriptionNumber = prescriptionNumber;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public Long getPrimaryPharmacistId() {
        return primaryPharmacistId;
    }

    public void setPrimaryPharmacistId(Long primaryPharmacistId) {
        this.primaryPharmacistId = primaryPharmacistId;
    }

    public String getPrimaryPharmacistName() {
        return primaryPharmacistName;
    }

    public void setPrimaryPharmacistName(String primaryPharmacistName) {
        this.primaryPharmacistName = primaryPharmacistName;
    }

    public Long getSecondaryPharmacistId() {
        return secondaryPharmacistId;
    }

    public void setSecondaryPharmacistId(Long secondaryPharmacistId) {
        this.secondaryPharmacistId = secondaryPharmacistId;
    }

    public String getSecondaryPharmacistName() {
        return secondaryPharmacistName;
    }

    public void setSecondaryPharmacistName(String secondaryPharmacistName) {
        this.secondaryPharmacistName = secondaryPharmacistName;
    }

    public String getPrimaryDigitalSigMasked() {
        return primaryDigitalSigMasked;
    }

    public void setPrimaryDigitalSigMasked(String primaryDigitalSigMasked) {
        this.primaryDigitalSigMasked = primaryDigitalSigMasked;
    }

    public String getSecondaryDigitalSigMasked() {
        return secondaryDigitalSigMasked;
    }

    public void setSecondaryDigitalSigMasked(String secondaryDigitalSigMasked) {
        this.secondaryDigitalSigMasked = secondaryDigitalSigMasked;
    }

    public Integer getOpeningBalance() {
        return openingBalance;
    }

    public void setOpeningBalance(Integer openingBalance) {
        this.openingBalance = openingBalance;
    }

    public Integer getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(Integer closingBalance) {
        this.closingBalance = closingBalance;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Boolean getIsEmergencyOverride() {
        return isEmergencyOverride;
    }

    public void setIsEmergencyOverride(Boolean isEmergencyOverride) {
        this.isEmergencyOverride = isEmergencyOverride;
    }

    public Boolean getRetrospectiveApproved() {
        return retrospectiveApproved;
    }

    public void setRetrospectiveApproved(Boolean retrospectiveApproved) {
        this.retrospectiveApproved = retrospectiveApproved;
    }

    public String getRetrospectiveApprovedByName() {
        return retrospectiveApprovedByName;
    }

    public void setRetrospectiveApprovedByName(String retrospectiveApprovedByName) {
        this.retrospectiveApprovedByName = retrospectiveApprovedByName;
    }

    public LocalDateTime getRetrospectiveApprovedAt() {
        return retrospectiveApprovedAt;
    }

    public void setRetrospectiveApprovedAt(LocalDateTime retrospectiveApprovedAt) {
        this.retrospectiveApprovedAt = retrospectiveApprovedAt;
    }

    public String getVarianceReason() {
        return varianceReason;
    }

    public void setVarianceReason(String varianceReason) {
        this.varianceReason = varianceReason;
    }

    public String getVerificationHash() {
        return verificationHash;
    }

    public void setVerificationHash(String verificationHash) {
        this.verificationHash = verificationHash;
    }
}
