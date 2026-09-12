package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "po_number", nullable = false, unique = true, length = 50)
    private String poNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    @NotNull(message = "Supplier is required")
    private Supplier supplier;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private POStatus status = POStatus.DRAFT;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PurchaseOrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PurchaseOrder() {
        this.orderDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public PurchaseOrder(String poNumber, Supplier supplier, LocalDate expectedDeliveryDate, POStatus status, String notes, User createdBy) {
        this.poNumber = poNumber;
        this.supplier = supplier;
        this.orderDate = LocalDate.now();
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.status = status != null ? status : POStatus.DRAFT;
        this.notes = notes;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.orderDate == null) {
            this.orderDate = LocalDate.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addItem(PurchaseOrderItem item) {
        items.add(item);
        item.setPurchaseOrder(this);
        recalculateTotalAmount();
    }

    public void removeItem(PurchaseOrderItem item) {
        items.remove(item);
        item.setPurchaseOrder(null);
        recalculateTotalAmount();
    }

    public void recalculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(PurchaseOrderItem::getTotalPrice)
                .filter(val -> val != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public POStatus getStatus() { return status; }
    public void setStatus(POStatus status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) {
        this.items = items;
        if (items != null) {
            items.forEach(i -> i.setPurchaseOrder(this));
        }
        recalculateTotalAmount();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
