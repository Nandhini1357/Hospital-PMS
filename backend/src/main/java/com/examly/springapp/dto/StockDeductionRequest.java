package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockDeductionRequest {

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    @NotNull(message = "Quantity to deduct is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public StockDeductionRequest() {}

    public StockDeductionRequest(Long drugId, Integer quantity) {
        this.drugId = drugId;
        this.quantity = quantity;
    }

    public Long getDrugId() {
        return drugId;
    }

    public void setDrugId(Long drugId) {
        this.drugId = drugId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
