package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    @JsonIgnore
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false)
    @NotNull(message = "Drug is required for PO item")
    private Drug drug;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "total_price", precision = 12, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    public PurchaseOrderItem() {}

    public PurchaseOrderItem(Drug drug, Integer quantity, BigDecimal unitPrice) {
        this.drug = drug;
        this.quantity = quantity;
        this.unitPrice = unitPrice != null ? unitPrice : BigDecimal.ZERO;
        recalculateTotalPrice();
    }

    public void recalculateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        } else {
            this.totalPrice = BigDecimal.ZERO;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }

    public Drug getDrug() { return drug; }
    public void setDrug(Drug drug) { this.drug = drug; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        recalculateTotalPrice();
    }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        recalculateTotalPrice();
    }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
