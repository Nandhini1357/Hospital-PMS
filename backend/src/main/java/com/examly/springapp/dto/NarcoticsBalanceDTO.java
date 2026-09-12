package com.examly.springapp.dto;

public class NarcoticsBalanceDTO {

    private Long drugId;
    private String drugName;
    private String drugCode;
    private String batchNo;
    private Integer openingStock;
    private Integer totalReceived;
    private Integer totalDispensed;
    private Integer totalReturned;
    private Integer totalDestroyed;
    private Integer expectedClosingStock;
    private Integer physicalStock;
    private Double variancePercentage;
    private Boolean isVarianceFlagged;

    public NarcoticsBalanceDTO() {}

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

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public Integer getOpeningStock() {
        return openingStock;
    }

    public void setOpeningStock(Integer openingStock) {
        this.openingStock = openingStock;
    }

    public Integer getTotalReceived() {
        return totalReceived;
    }

    public void setTotalReceived(Integer totalReceived) {
        this.totalReceived = totalReceived;
    }

    public Integer getTotalDispensed() {
        return totalDispensed;
    }

    public void setTotalDispensed(Integer totalDispensed) {
        this.totalDispensed = totalDispensed;
    }

    public Integer getTotalReturned() {
        return totalReturned;
    }

    public void setTotalReturned(Integer totalReturned) {
        this.totalReturned = totalReturned;
    }

    public Integer getTotalDestroyed() {
        return totalDestroyed;
    }

    public void setTotalDestroyed(Integer totalDestroyed) {
        this.totalDestroyed = totalDestroyed;
    }

    public Integer getExpectedClosingStock() {
        return expectedClosingStock;
    }

    public void setExpectedClosingStock(Integer expectedClosingStock) {
        this.expectedClosingStock = expectedClosingStock;
    }

    public Integer getPhysicalStock() {
        return physicalStock;
    }

    public void setPhysicalStock(Integer physicalStock) {
        this.physicalStock = physicalStock;
    }

    public Double getVariancePercentage() {
        return variancePercentage;
    }

    public void setVariancePercentage(Double variancePercentage) {
        this.variancePercentage = variancePercentage;
    }

    public Boolean getIsVarianceFlagged() {
        return isVarianceFlagged;
    }

    public void setIsVarianceFlagged(Boolean isVarianceFlagged) {
        this.isVarianceFlagged = isVarianceFlagged;
    }
}
