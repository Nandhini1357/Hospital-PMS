package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class MedicationHistoryDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private String patientNumber;
    private Long prescriptionId;
    private String prescriptionNumber;
    private Long drugId;
    private String drugName;
    private String drugCode;
    private String categoryName;
    private String dosage;
    private String frequency;
    private Integer quantityDispensed;
    private LocalDateTime dispensedDate;
    private String pharmacistName;
    private String notes;

    public MedicationHistoryDTO() {}

    public MedicationHistoryDTO(Long id, Long patientId, String patientName, String patientNumber, Long prescriptionId, String prescriptionNumber, Long drugId, String drugName, String drugCode, String categoryName, String dosage, String frequency, Integer quantityDispensed, LocalDateTime dispensedDate, String pharmacistName, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.prescriptionId = prescriptionId;
        this.prescriptionNumber = prescriptionNumber;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.categoryName = categoryName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.quantityDispensed = quantityDispensed;
        this.dispensedDate = dispensedDate;
        this.pharmacistName = pharmacistName;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public Integer getQuantityDispensed() { return quantityDispensed; }
    public void setQuantityDispensed(Integer quantityDispensed) { this.quantityDispensed = quantityDispensed; }

    public LocalDateTime getDispensedDate() { return dispensedDate; }
    public void setDispensedDate(LocalDateTime dispensedDate) { this.dispensedDate = dispensedDate; }

    public String getPharmacistName() { return pharmacistName; }
    public void setPharmacistName(String pharmacistName) { this.pharmacistName = pharmacistName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
