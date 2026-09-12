package com.examly.springapp.dto;

import com.examly.springapp.model.Role;
import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private Role role = Role.PHARMACIST;

    private String licenceNumber;
    private String employeeId;

    @NotBlank(message = "Phone number is required")
    private String mobile;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String email, String password, Role role, 
                           String licenceNumber, String employeeId, String mobile) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : Role.PHARMACIST;
        this.licenceNumber = licenceNumber;
        this.employeeId = employeeId;
        this.mobile = mobile;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getLicenceNumber() { return licenceNumber; }
    public void setLicenceNumber(String licenceNumber) { this.licenceNumber = licenceNumber; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
}
