package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(name = "licence_number", length = 50)
    private String licenceNumber;

    @Column(name = "employee_id", length = 50)
    private String employeeId;

    @Column(nullable = false, length = 10)
    private String mobile;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "failed_attempts", nullable = false)
    private Integer failedAttempts = 0;

    @Column(name = "lockout_until")
    private LocalDateTime lockoutUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(Long id, String fullName, String email, String password, Role role, 
                String licenceNumber, String employeeId, String mobile, Boolean isActive) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.licenceNumber = licenceNumber;
        this.employeeId = employeeId;
        this.mobile = mobile;
        this.isActive = isActive != null ? isActive : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }

    public LocalDateTime getLockoutUntil() { return lockoutUntil; }
    public void setLockoutUntil(LocalDateTime lockoutUntil) { this.lockoutUntil = lockoutUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
