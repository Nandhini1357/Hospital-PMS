package com.examly.springapp.dto;

import java.math.BigDecimal;

public class AutoPODraftSuggestionDTO {

    private Long drugId;
    private String drugName;
    private String drugCode;
    private String categoryName;
    private Integer currentStock;
    private Integer reorderLevel;
    private Integer suggestedReorderQuantity;
    private Long suggestedSupplierId;
    private String suggestedSupplierName;
    private BigDecimal estimatedUnitPrice;

    public AutoPODraftSuggestionDTO() {}

    public AutoPODraftSuggestionDTO(Long drugId, String drugName, String drugCode, String categoryName, Integer currentStock, Integer reorderLevel, Integer suggestedReorderQuantity, Long suggestedSupplierId, String suggestedSupplierName, BigDecimal estimatedUnitPrice) {
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.categoryName = categoryName;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.suggestedReorderQuantity = suggestedReorderQuantity;
        this.suggestedSupplierId = suggestedSupplierId;
        this.suggestedSupplierName = suggestedSupplierName;
        this.estimatedUnitPrice = estimatedUnitPrice;
    }

    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public Integer getSuggestedReorderQuantity() { return suggestedReorderQuantity; }
    public void setSuggestedReorderQuantity(Integer suggestedReorderQuantity) { this.suggestedReorderQuantity = suggestedReorderQuantity; }

    public Long getSuggestedSupplierId() { return suggestedSupplierId; }
    public void setSuggestedSupplierId(Long suggestedSupplierId) { this.suggestedSupplierId = suggestedSupplierId; }

    public String getSuggestedSupplierName() { return suggestedSupplierName; }
    public void setSuggestedSupplierName(String suggestedSupplierName) { this.suggestedSupplierName = suggestedSupplierName; }

    public BigDecimal getEstimatedUnitPrice() { return estimatedUnitPrice; }
    public void setEstimatedUnitPrice(BigDecimal estimatedUnitPrice) { this.estimatedUnitPrice = estimatedUnitPrice; }
}
