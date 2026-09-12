package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "drugs")
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Drug name is required")
    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @NotBlank(message = "Drug code/SKU is required")
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Drug category is required")
    private DrugCategory category;

    @NotBlank(message = "Unit of measurement is required")
    @Column(nullable = false, length = 50)
    private String unit; // e.g., Tablet, Syrup, Injection, Vial, Capsule

    @Min(value = 0, message = "Reorder level must be 0 or greater")
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    @Column(name = "is_schedule_h1")
    private Boolean isScheduleH1 = false;

    @Column(name = "is_narcotic")
    private Boolean isNarcotic = false;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Drug() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Drug(String name, String genericName, String code, DrugCategory category, String unit, Integer reorderLevel, String description) {
        this.name = name;
        this.genericName = genericName;
        this.code = code;
        this.category = category;
        this.unit = unit;
        this.reorderLevel = reorderLevel != null ? reorderLevel : 10;
        this.description = description;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public DrugCategory getCategory() {
        return category;
    }

    public void setCategory(DrugCategory category) {
        this.category = category;
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

    public Boolean getIsScheduleH1() {
        return isScheduleH1 != null ? isScheduleH1 : false;
    }

    public void setIsScheduleH1(Boolean isScheduleH1) {
        this.isScheduleH1 = isScheduleH1;
    }

    public Boolean getIsNarcotic() {
        return isNarcotic != null ? isNarcotic : false;
    }

    public void setIsNarcotic(Boolean isNarcotic) {
        this.isNarcotic = isNarcotic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
