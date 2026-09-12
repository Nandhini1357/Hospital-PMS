package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PrescriptionItemDTO {

    private Long id;

    @NotNull(message = "Drug selection is required")
    private Long drugId;

    private String drugName;
    private String drugCode;
    private String categoryName;
    private String unit;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    @NotBlank(message = "Frequency is required")
    private String frequency;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String instructions;
    private Integer availableStock;
    private Boolean isStockSufficient;

    public PrescriptionItemDTO() {}

    public PrescriptionItemDTO(Long id, Long drugId, String drugName, String drugCode, String categoryName, String unit, String dosage, String frequency, String duration, Integer quantity, String instructions) {
        this.id = id;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.categoryName = categoryName;
        this.unit = unit;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.quantity = quantity;
        this.instructions = instructions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }

    public Boolean getIsStockSufficient() { return isStockSufficient; }
    public void setIsStockSufficient(Boolean isStockSufficient) { this.isStockSufficient = isStockSufficient; }
}
