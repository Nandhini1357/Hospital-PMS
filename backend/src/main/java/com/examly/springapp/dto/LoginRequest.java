package com.examly.springapp.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Login credential (email/employeeId/licence) is required")
    private String credential;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String credential, String password) {
        this.credential = credential;
        this.password = password;
    }

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
