package com.examly.springapp.controller;

import com.examly.springapp.dto.*;
import com.examly.springapp.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "Authentication", description = "Endpoints for user registration, login, logout, and password recovery")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        AuthResponse response = authService.registerUser(request, clientIp);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        AuthResponse response = authService.loginUser(request, clientIp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Collections.singletonMap("message", "OTP sent to registered email with 15-minute validity window."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Collections.singletonMap("message", "Password reset successfully. You can now login."));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam("email") String email) {
        boolean exists = authService.checkEmailExists(email);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }
}
