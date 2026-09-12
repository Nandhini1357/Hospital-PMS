package com.examly.springapp.service;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.PasswordReset;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.SecurityAuditLog;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.PasswordResetRepository;
import com.examly.springapp.repository.SecurityAuditLogRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityAuditLogRepository auditLogRepository;

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request, String ipAddress) {
        // Validation 1: Full Name alphabetic & spaces check
        if (request.getFullName() == null || !request.getFullName().matches("^[a-zA-Z\\s]+$")) {
            throw new InvalidNameException("Drug name must not contain special characters or numbers");
        }

        // Validation 2: Mobile exactly 10 numeric digits
        if (request.getMobile() == null || !request.getMobile().matches("^\\d{10}$")) {
            throw new InvalidPhoneException("Phone Number must be exactly 10 digits long");
        }

        // Validation 3: Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidNameException("Email address is already registered: " + request.getEmail());
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.PHARMACIST;

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setLicenceNumber(request.getLicenceNumber());
        user.setEmployeeId(request.getEmployeeId());
        user.setMobile(request.getMobile().trim());
        user.setIsActive(true);
        user.setFailedAttempts(0);

        User savedUser = userRepository.save(user);

        // Security Log
        auditLogRepository.save(new SecurityAuditLog(
                savedUser.getId(),
                savedUser.getEmail(),
                "REGISTER_SUCCESS",
                "User registered with role: " + savedUser.getRole(),
                ipAddress
        ));

        String token = tokenProvider.generateToken(savedUser);
        long expiresInMs = tokenProvider.getExpirationMsForRole(savedUser.getRole());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                expiresInMs,
                "Registration successful! Please verify your email."
        );
    }

    @Transactional
    public AuthResponse loginUser(LoginRequest request, String ipAddress) {
        User user = userRepository.findByCredential(request.getCredential())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials. Please check your email and password."));

        // Progressive Lockout check
        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new BadCredentialsException("Account locked due to multiple failed login attempts. Try again after: " + user.getLockoutUntil());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            int newFailedCount = user.getFailedAttempts() + 1;
            user.setFailedAttempts(newFailedCount);

            if (newFailedCount >= 15) {
                user.setLockoutUntil(LocalDateTime.now().plusHours(24));
            } else if (newFailedCount >= 10) {
                user.setLockoutUntil(LocalDateTime.now().plusMinutes(30));
            } else if (newFailedCount >= 5) {
                user.setLockoutUntil(LocalDateTime.now().plusMinutes(15));
            }

            userRepository.save(user);

            auditLogRepository.save(new SecurityAuditLog(
                    user.getId(),
                    user.getEmail(),
                    "LOGIN_FAILURE",
                    "Failed login attempt #" + newFailedCount,
                    ipAddress
            ));

            throw new BadCredentialsException("Invalid credentials. Please check your email and password.");
        }

        // Reset failed attempts on success
        user.setFailedAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        auditLogRepository.save(new SecurityAuditLog(
                user.getId(),
                user.getEmail(),
                "LOGIN_SUCCESS",
                "User logged in successfully",
                ipAddress
        ));

        String token = tokenProvider.generateToken(user);
        long expiresInMs = tokenProvider.getExpirationMsForRole(user.getRole());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                expiresInMs,
                "Login successful"
        );
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", (int) (Math.random() * 1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15); // 15 minute validity window

        PasswordReset passwordReset = new PasswordReset(user.getEmail(), otpCode, expiryTime);
        passwordResetRepository.save(passwordReset);

        auditLogRepository.save(new SecurityAuditLog(
                user.getId(),
                user.getEmail(),
                "FORGOT_PASSWORD_REQUEST",
                "Generated OTP valid for 15 minutes",
                "INTERNAL"
        ));
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordReset resetRecord = passwordResetRepository
                .findTopByEmailAndOtpCodeAndIsUsedFalseOrderByCreatedAtDesc(request.getEmail(), request.getOtpCode())
                .orElseThrow(() -> new InvalidNameException("Invalid or expired OTP code"));

        if (resetRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new InvalidNameException("OTP code has expired. Please request a new one.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetRecord.setIsUsed(true);
        passwordResetRepository.save(resetRecord);

        auditLogRepository.save(new SecurityAuditLog(
                user.getId(),
                user.getEmail(),
                "PASSWORD_RESET_SUCCESS",
                "Password updated successfully via OTP",
                "INTERNAL"
        ));
    }
}
