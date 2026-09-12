package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_audit_logs")
public class SecurityAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_identity")
    private String userIdentity;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public SecurityAuditLog() {}

    public SecurityAuditLog(String action, String userIdentity, String details) {
        this.action = action;
        this.userIdentity = userIdentity;
        this.details = details;
        this.ipAddress = "127.0.0.1";
        this.timestamp = LocalDateTime.now();
    }

    public SecurityAuditLog(Long userId, String userIdentity, String action, String details, String ipAddress) {
        this.userId = userId;
        this.userIdentity = userIdentity;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserIdentity() { return userIdentity; }
    public void setUserIdentity(String userIdentity) { this.userIdentity = userIdentity; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
