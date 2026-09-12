package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goods_receipt_notes")
public class GoodsReceiptNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grn_number", nullable = false, unique = true, length = 50)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    @NotNull(message = "Purchase Order is required for GRN")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    @NotNull(message = "Supplier is required for GRN")
    private Supplier supplier;

    @Column(name = "invoice_number", length = 100)
    private String invoiceNumber;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "received_by_id")
    private User receivedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GRNStatus status = GRNStatus.PENDING_INSPECTION;

    @Column(length = 500)
    private String notes;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<GRNItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public GoodsReceiptNote() {
        this.receivedDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    public GoodsReceiptNote(String grnNumber, PurchaseOrder purchaseOrder, Supplier supplier, String invoiceNumber, LocalDate receivedDate, User receivedBy, String notes) {
        this.grnNumber = grnNumber;
        this.purchaseOrder = purchaseOrder;
        this.supplier = supplier;
        this.invoiceNumber = invoiceNumber;
        this.receivedDate = receivedDate != null ? receivedDate : LocalDate.now();
        this.receivedBy = receivedBy;
        this.status = GRNStatus.PENDING_INSPECTION;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.receivedDate == null) {
            this.receivedDate = LocalDate.now();
        }
    }

    public void addItem(GRNItem item) {
        items.add(item);
        item.setGrn(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGrnNumber() { return grnNumber; }
    public void setGrnNumber(String grnNumber) { this.grnNumber = grnNumber; }

    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public LocalDate getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDate receivedDate) { this.receivedDate = receivedDate; }

    public User getReceivedBy() { return receivedBy; }
    public void setReceivedBy(User receivedBy) { this.receivedBy = receivedBy; }

    public GRNStatus getStatus() { return status; }
    public void setStatus(GRNStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<GRNItem> getItems() { return items; }
    public void setItems(List<GRNItem> items) {
        this.items = items;
        if (items != null) {
            items.forEach(i -> i.setGrn(this));
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
