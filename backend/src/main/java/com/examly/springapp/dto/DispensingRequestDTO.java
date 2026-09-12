package com.examly.springapp.dto;

import jakarta.validation.constraints.NotNull;

public class DispensingRequestDTO {

    @NotNull(message = "Prescription ID is required")
    private Long prescriptionId;

    private String notes;

    public DispensingRequestDTO() {}

    public DispensingRequestDTO(Long prescriptionId, String notes) {
        this.prescriptionId = prescriptionId;
        this.notes = notes;
    }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
