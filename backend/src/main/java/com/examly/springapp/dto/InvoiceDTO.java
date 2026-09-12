package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class InvoiceDTO {

    private Long id;
    private String invoiceNumber;
    private Long patientId;
    private String patientName;
    private String patientNumber;
    private Long prescriptionId;
    private String prescriptionNumber;
    private Double subtotal;
    private Double gstAmount;
    private Double insuranceCoverage;
    private Double netAmount;
    private Double amountPaid;
    private Double balanceDue;
    private String paymentStatus;
    private String paymentMethod;
    private String transactionReference;
    private LocalDateTime invoiceDate;
    private LocalDateTime paidAt;

    public InvoiceDTO() {}

    public InvoiceDTO(Long id, String invoiceNumber, Long patientId, String patientName, String patientNumber,
                      Long prescriptionId, String prescriptionNumber, Double subtotal, Double gstAmount,
                      Double insuranceCoverage, Double netAmount, Double amountPaid, Double balanceDue,
                      String paymentStatus, String paymentMethod, String transactionReference,
                      LocalDateTime invoiceDate, LocalDateTime paidAt) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.prescriptionId = prescriptionId;
        this.prescriptionNumber = prescriptionNumber;
        this.subtotal = subtotal;
        this.gstAmount = gstAmount;
        this.insuranceCoverage = insuranceCoverage;
        this.netAmount = netAmount;
        this.amountPaid = amountPaid;
        this.balanceDue = balanceDue;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.transactionReference = transactionReference;
        this.invoiceDate = invoiceDate;
        this.paidAt = paidAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

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

    public Double getBalanceDue() { return balanceDue; }
    public void setBalanceDue(Double balanceDue) { this.balanceDue = balanceDue; }

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
