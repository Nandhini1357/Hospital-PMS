package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @Column(nullable = false)
    private Double subtotal = 0.0;

    @Column(name = "gst_amount", nullable = false)
    private Double gstAmount = 0.0;

    @Column(name = "insurance_coverage", nullable = false)
    private Double insuranceCoverage = 0.0;

    @Column(name = "net_amount", nullable = false)
    private Double netAmount = 0.0;

    @Column(name = "amount_paid", nullable = false)
    private Double amountPaid = 0.0;

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus = "UNPAID";

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "invoice_date", nullable = false, updatable = false)
    private LocalDateTime invoiceDate = LocalDateTime.now();

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public Invoice() {}

    public Invoice(String invoiceNumber, Patient patient, Prescription prescription, Double subtotal, Double gstAmount, Double insuranceCoverage, Double netAmount) {
        this.invoiceNumber = invoiceNumber;
        this.patient = patient;
        this.prescription = prescription;
        this.subtotal = subtotal;
        this.gstAmount = gstAmount;
        this.insuranceCoverage = insuranceCoverage;
        this.netAmount = netAmount;
        this.amountPaid = 0.0;
        this.paymentStatus = "UNPAID";
        this.invoiceDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getGstAmount() { return gstAmount; }
    public void setGstAmount(Double gstAmount) { this.gstAmount = gstAmount; }

    public Double getInsuranceCoverage() { return insuranceCoverage; }
    public void setInsuranceCoverage(Double insuranceCoverage) { this.insuranceCoverage = insuranceCoverage; }

    public Double getNetAmount() { return netAmount; }
    public void setNetAmount(Double netAmount) { this.netAmount = netAmount; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDateTime getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDateTime invoiceDate) { this.invoiceDate = invoiceDate; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}
