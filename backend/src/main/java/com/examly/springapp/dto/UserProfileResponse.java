package com.examly.springapp.dto;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;

import java.time.LocalDateTime;

public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String licenceNumber;
    private String employeeId;
    private String mobile;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public UserProfileResponse() {}

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.licenceNumber = user.getLicenceNumber();
        this.employeeId = user.getEmployeeId();
        this.mobile = user.getMobile();
        this.isActive = user.getIsActive();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getLicenceNumber() { return licenceNumber; }
    public void setLicenceNumber(String licenceNumber) { this.licenceNumber = licenceNumber; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
