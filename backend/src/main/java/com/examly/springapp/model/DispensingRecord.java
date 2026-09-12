package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispensing_records")
public class DispensingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dispensing_number", nullable = false, unique = true, length = 50)
    private String dispensingNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pharmacist_id", nullable = false)
    private User pharmacist;

    @Column(name = "dispensed_at", nullable = false)
    private LocalDateTime dispensedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;

    public DispensingRecord() {}

    public DispensingRecord(String dispensingNumber, Prescription prescription, User pharmacist, String notes) {
        this.dispensingNumber = dispensingNumber;
        this.prescription = prescription;
        this.pharmacist = pharmacist;
        this.notes = notes;
        this.dispensedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDispensingNumber() { return dispensingNumber; }
    public void setDispensingNumber(String dispensingNumber) { this.dispensingNumber = dispensingNumber; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public User getPharmacist() { return pharmacist; }
    public void setPharmacist(User pharmacist) { this.pharmacist = pharmacist; }

    public LocalDateTime getDispensedAt() { return dispensedAt; }
    public void setDispensedAt(LocalDateTime dispensedAt) { this.dispensedAt = dispensedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
