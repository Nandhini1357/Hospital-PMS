package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PurchaseOrderItemDTO {

    private Long id;

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    private String drugName;
    private String drugCode;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    public PurchaseOrderItemDTO() {}

    public PurchaseOrderItemDTO(Long id, Long drugId, String drugName, String drugCode, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
