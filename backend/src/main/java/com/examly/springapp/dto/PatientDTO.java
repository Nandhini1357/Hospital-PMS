package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class PatientDTO {

    private Long id;
    private String patientNumber;

    @NotBlank(message = "Patient full name is required")
    private String fullName;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private String address;
    private String allergies;
    private String medicalHistory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PatientDTO() {}

    public PatientDTO(Long id, String patientNumber, String fullName, Integer age, String gender, String contactNumber, String address, String allergies, String medicalHistory, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientNumber = patientNumber;
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.address = address;
        this.allergies = allergies;
        this.medicalHistory = medicalHistory;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
