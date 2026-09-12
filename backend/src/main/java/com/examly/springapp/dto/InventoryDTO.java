package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class InventoryDTO {
    private Long id;
    private Long drugId;
    private String drugName;
    private String drugCode;
    private String categoryName;
    private String unit;
    private Integer totalQuantity;
    private Integer reorderLevel;
    private Boolean isLowStock;
    private Integer batchCount;
    private LocalDateTime lastUpdated;

    public InventoryDTO() {}

    public InventoryDTO(Long id, Long drugId, String drugName, String drugCode, String categoryName, String unit, Integer totalQuantity, Integer reorderLevel, Boolean isLowStock, Integer batchCount, LocalDateTime lastUpdated) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.categoryName = categoryName;
        this.unit = unit;
        this.totalQuantity = totalQuantity;
        this.reorderLevel = reorderLevel;
        this.isLowStock = isLowStock;
        this.batchCount = batchCount;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDrugId() {
        return drugId;
    }

    public void setDrugId(Long drugId) {
        this.drugId = drugId;
    }

    public String getDrugName() {
        return drugName;
    }

    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    public String getDrugCode() {
        return drugCode;
    }

    public void setDrugCode(String drugCode) {
        this.drugCode = drugCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Boolean getIsLowStock() {
        return isLowStock;
    }

    public void setIsLowStock(Boolean isLowStock) {
        this.isLowStock = isLowStock;
    }

    public Integer getBatchCount() {
        return batchCount;
    }

    public void setBatchCount(Integer batchCount) {
        this.batchCount = batchCount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
