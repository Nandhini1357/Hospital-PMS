package com.examly.springapp.dto;

import com.examly.springapp.model.PrescriptionStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PrescriptionDTO {

    private Long id;
    private String prescriptionNumber;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private String patientName;
    private String patientNumber;

    private Long doctorId;
    private String doctorName;

    private PrescriptionStatus status;
    private String notes;

    @NotEmpty(message = "Prescription must contain at least one drug item")
    @Valid
    private List<PrescriptionItemDTO> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PrescriptionDTO() {}

    public PrescriptionDTO(Long id, String prescriptionNumber, Long patientId, String patientName, String patientNumber, Long doctorId, String doctorName, PrescriptionStatus status, String notes, List<PrescriptionItemDTO> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.prescriptionNumber = prescriptionNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.status = status;
        this.notes = notes;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public PrescriptionStatus getStatus() { return status; }
    public void setStatus(PrescriptionStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<PrescriptionItemDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemDTO> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
