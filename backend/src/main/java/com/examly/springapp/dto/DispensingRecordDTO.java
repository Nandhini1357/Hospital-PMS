package com.examly.springapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DispensingRecordDTO {

    private Long id;
    private String dispensingNumber;
    private Long prescriptionId;
    private String prescriptionNumber;
    private Long patientId;
    private String patientName;
    private String patientNumber;
    private Long pharmacistId;
    private String pharmacistName;
    private LocalDateTime dispensedAt;
    private String notes;
    private List<PrescriptionItemDTO> items;
    private List<DrugDTO> lowStockAlerts;

    public DispensingRecordDTO() {}

    public DispensingRecordDTO(Long id, String dispensingNumber, Long prescriptionId, String prescriptionNumber, Long patientId, String patientName, String patientNumber, Long pharmacistId, String pharmacistName, LocalDateTime dispensedAt, String notes, List<PrescriptionItemDTO> items) {
        this.id = id;
        this.dispensingNumber = dispensingNumber;
        this.prescriptionId = prescriptionId;
        this.prescriptionNumber = prescriptionNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.pharmacistId = pharmacistId;
        this.pharmacistName = pharmacistName;
        this.dispensedAt = dispensedAt;
        this.notes = notes;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDispensingNumber() { return dispensingNumber; }
    public void setDispensingNumber(String dispensingNumber) { this.dispensingNumber = dispensingNumber; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }

    public Long getPharmacistId() { return pharmacistId; }
    public void setPharmacistId(Long pharmacistId) { this.pharmacistId = pharmacistId; }

    public String getPharmacistName() { return pharmacistName; }
    public void setPharmacistName(String pharmacistName) { this.pharmacistName = pharmacistName; }

    public LocalDateTime getDispensedAt() { return dispensedAt; }
    public void setDispensedAt(LocalDateTime dispensedAt) { this.dispensedAt = dispensedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<PrescriptionItemDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemDTO> items) { this.items = items; }

    public List<DrugDTO> getLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(List<DrugDTO> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; }
}
