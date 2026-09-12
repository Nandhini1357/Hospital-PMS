package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class SupplierDTO {
    private Long id;

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String gstin;
    private Boolean isActive = true;
    private LocalDateTime createdAt;

    public SupplierDTO() {}

    public SupplierDTO(Long id, String name, String contactPerson, String email, String phone, String address, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.isActive = true;
        this.createdAt = createdAt;
    }

    public SupplierDTO(Long id, String name, String contactPerson, String email, String phone, String address, String gstin, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gstin = gstin;
        this.isActive = isActive != null ? isActive : true;
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

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
