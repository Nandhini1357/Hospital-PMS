package com.examly.springapp.dto;

import com.examly.springapp.model.Role;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
    private long expiresInMs;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String fullName, String email, Role role, long expiresInMs, String message) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.expiresInMs = expiresInMs;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(long expiresInMs) { this.expiresInMs = expiresInMs; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
