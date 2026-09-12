package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "narcotics_register", indexes = {
        @Index(name = "idx_narcotics_drug_date", columnList = "drug_id, timestamp"),
        @Index(name = "idx_narcotics_batch", columnList = "batch_no")
})
public class NarcoticsRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false)
    @NotNull(message = "Drug is required")
    private Drug drug;

    @NotBlank(message = "Batch number is required")
    @Column(name = "batch_no", nullable = false, length = 100)
    private String batchNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @NotNull(message = "Quantity is required")
    @Column(nullable = false)
    private Integer quantity;

    @NotBlank(message = "Transaction type is required")
    @Column(name = "transaction_type", nullable = false, length = 50)
    private String transactionType; // RECEIPT, DISPENSE, RETURN, DESTRUCTION, RECONCILIATION

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_pharmacist_id", nullable = false)
    @NotNull(message = "Primary pharmacist is required")
    private User primaryPharmacist;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "secondary_pharmacist_id")
    private User secondaryPharmacist;

    @NotBlank(message = "Primary digital signature is required")
    @Column(name = "primary_digital_sig", nullable = false, columnDefinition = "TEXT")
    private String primaryDigitalSig;

    @Column(name = "secondary_digital_sig", columnDefinition = "TEXT")
    private String secondaryDigitalSig;

    @NotNull(message = "Opening balance is required")
    @Column(name = "opening_balance", nullable = false)
    private Integer openingBalance;

    @NotNull(message = "Closing balance is required")
    @Column(name = "closing_balance", nullable = false)
    private Integer closingBalance;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "witness_name", length = 150)
    private String witnessName;

    @Column(name = "destruction_method", length = 255)
    private String destructionMethod;

    @Column(length = 150)
    private String manufacturer;

    @Column(name = "supplier_invoice", length = 100)
    private String supplierInvoice;

    @Column(name = "doctor_name", length = 150)
    private String doctorName;

    @Column(name = "patient_name", length = 150)
    private String patientName;

    @Column(name = "is_emergency_override", nullable = false)
    private Boolean isEmergencyOverride = false;

    @Column(name = "retrospective_approved", nullable = false)
    private Boolean retrospectiveApproved = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "retrospective_approved_by")
    private User retrospectiveApprovedBy;

    @Column(name = "retrospective_approved_at")
    private LocalDateTime retrospectiveApprovedAt;

    @Column(name = "variance_reason", columnDefinition = "TEXT")
    private String varianceReason;

    @Column(name = "verification_hash", length = 255)
    private String verificationHash;

    public NarcoticsRegister() {
        this.timestamp = LocalDateTime.now();
    }

    public NarcoticsRegister(Drug drug, String batchNo, Prescription prescription, Integer quantity,
                             String transactionType, User primaryPharmacist, User secondaryPharmacist,
                             String primaryDigitalSig, String secondaryDigitalSig,
                             Integer openingBalance, Integer closingBalance) {
        this.drug = drug;
        this.batchNo = batchNo;
        this.prescription = prescription;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.primaryPharmacist = primaryPharmacist;
        this.secondaryPharmacist = secondaryPharmacist;
        this.primaryDigitalSig = primaryDigitalSig;
        this.secondaryDigitalSig = secondaryDigitalSig;
        this.openingBalance = openingBalance;
        this.closingBalance = closingBalance;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Drug getDrug() {
        return drug;
    }

    public void setDrug(Drug drug) {
        this.drug = drug;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
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

    public User getPrimaryPharmacist() {
        return primaryPharmacist;
    }

    public void setPrimaryPharmacist(User primaryPharmacist) {
        this.primaryPharmacist = primaryPharmacist;
    }

    public User getSecondaryPharmacist() {
        return secondaryPharmacist;
    }

    public void setSecondaryPharmacist(User secondaryPharmacist) {
        this.secondaryPharmacist = secondaryPharmacist;
    }

    public String getPrimaryDigitalSig() {
        return primaryDigitalSig;
    }

    public void setPrimaryDigitalSig(String primaryDigitalSig) {
        this.primaryDigitalSig = primaryDigitalSig;
    }

    public String getSecondaryDigitalSig() {
        return secondaryDigitalSig;
    }

    public void setSecondaryDigitalSig(String secondaryDigitalSig) {
        this.secondaryDigitalSig = secondaryDigitalSig;
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
        return isEmergencyOverride != null ? isEmergencyOverride : false;
    }

    public void setIsEmergencyOverride(Boolean isEmergencyOverride) {
        this.isEmergencyOverride = isEmergencyOverride;
    }

    public Boolean getRetrospectiveApproved() {
        return retrospectiveApproved != null ? retrospectiveApproved : false;
    }

    public void setRetrospectiveApproved(Boolean retrospectiveApproved) {
        this.retrospectiveApproved = retrospectiveApproved;
    }

    public User getRetrospectiveApprovedBy() {
        return retrospectiveApprovedBy;
    }

    public void setRetrospectiveApprovedBy(User retrospectiveApprovedBy) {
        this.retrospectiveApprovedBy = retrospectiveApprovedBy;
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
