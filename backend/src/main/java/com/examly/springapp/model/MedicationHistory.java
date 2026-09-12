package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_history")
public class MedicationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false)
    private Drug drug;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, length = 100)
    private String frequency;

    @Column(name = "quantity_dispensed", nullable = false)
    private Integer quantityDispensed;

    @Column(name = "dispensed_date", nullable = false)
    private LocalDateTime dispensedDate = LocalDateTime.now();

    @Column(name = "pharmacist_name", length = 100)
    private String pharmacistName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public MedicationHistory() {}

    public MedicationHistory(Patient patient, Prescription prescription, Drug drug, String dosage, String frequency, Integer quantityDispensed, LocalDateTime dispensedDate, String pharmacistName, String notes) {
        this.patient = patient;
        this.prescription = prescription;
        this.drug = drug;
        this.dosage = dosage;
        this.frequency = frequency;
        this.quantityDispensed = quantityDispensed;
        this.dispensedDate = dispensedDate != null ? dispensedDate : LocalDateTime.now();
        this.pharmacistName = pharmacistName;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public Drug getDrug() { return drug; }
    public void setDrug(Drug drug) { this.drug = drug; }

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
