package com.examly.springapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DrugDTO {
    private Long id;

    @NotBlank(message = "Drug name is required")
    private String name;

    private String genericName;

    @NotBlank(message = "Drug code/SKU is required")
    private String code;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;

    @NotBlank(message = "Unit of measurement is required")
    private String unit;

    @Min(value = 0, message = "Reorder level must be 0 or greater")
    private Integer reorderLevel = 10;

    private String description;
    private Integer totalStock = 0;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DrugDTO() {}

    public DrugDTO(Long id, String name, String genericName, String code, Long categoryId, String categoryName, String unit, Integer reorderLevel, String description, Integer totalStock, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.genericName = genericName;
        this.code = code;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.unit = unit;
        this.reorderLevel = reorderLevel;
        this.description = description;
        this.totalStock = totalStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(Integer totalStock) {
        this.totalStock = totalStock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
