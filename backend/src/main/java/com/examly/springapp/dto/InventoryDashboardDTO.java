package com.examly.springapp.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class InventoryDashboardDTO {
    private long totalDrugs;
    private long totalCategories;
    private long totalSuppliers;
    private long totalBatches;
    private long totalStockQuantity;
    private long lowStockDrugCount;
    private long expiringSoonBatchCount;
    private long expiredBatchCount;
    private BigDecimal totalInventoryValue;

    private List<DrugDTO> lowStockDrugs;
    private List<InventoryBatchDTO> expiringBatches;
    private Map<String, Long> categoryBreakdown;

    public InventoryDashboardDTO() {}

    public long getTotalDrugs() {
        return totalDrugs;
    }

    public void setTotalDrugs(long totalDrugs) {
        this.totalDrugs = totalDrugs;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public long getTotalBatches() {
        return totalBatches;
    }

    public void setTotalBatches(long totalBatches) {
        this.totalBatches = totalBatches;
    }

    public long getTotalStockQuantity() {
        return totalStockQuantity;
    }

    public void setTotalStockQuantity(long totalStockQuantity) {
        this.totalStockQuantity = totalStockQuantity;
    }

    public long getLowStockDrugCount() {
        return lowStockDrugCount;
    }

    public void setLowStockDrugCount(long lowStockDrugCount) {
        this.lowStockDrugCount = lowStockDrugCount;
    }

    public long getExpiringSoonBatchCount() {
        return expiringSoonBatchCount;
    }

    public void setExpiringSoonBatchCount(long expiringSoonBatchCount) {
        this.expiringSoonBatchCount = expiringSoonBatchCount;
    }

    public long getExpiredBatchCount() {
        return expiredBatchCount;
    }

    public void setExpiredBatchCount(long expiredBatchCount) {
        this.expiredBatchCount = expiredBatchCount;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public List<DrugDTO> getLowStockDrugs() {
        return lowStockDrugs;
    }

    public void setLowStockDrugs(List<DrugDTO> lowStockDrugs) {
        this.lowStockDrugs = lowStockDrugs;
    }

    public List<InventoryBatchDTO> getExpiringBatches() {
        return expiringBatches;
    }

    public void setExpiringBatches(List<InventoryBatchDTO> expiringBatches) {
        this.expiringBatches = expiringBatches;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
