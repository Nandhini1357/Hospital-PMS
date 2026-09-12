package com.examly.springapp.dto;

public class PaymentRequestDTO {

    private Long invoiceId;
    private Double amount;
    private String paymentMethod;
    private String notes;

    public PaymentRequestDTO() {}

    public PaymentRequestDTO(Long invoiceId, Double amount, String paymentMethod, String notes) {
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
