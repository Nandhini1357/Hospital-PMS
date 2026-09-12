package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class DrugCategoryDTO {
    private Long id;

    @NotBlank(message = "Category name is mandatory")
    private String name;

    private String description;
    private LocalDateTime createdAt;

    public DrugCategoryDTO() {}

    public DrugCategoryDTO(Long id, String name, String description, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
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
}
