package com.examly.springapp;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.model.Role;
import com.examly.springapp.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should successfully register a valid pharmacist user")
    void testSuccessfulRegistration() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john.doe@pharmacy.com",
                "Password123!",
                Role.PHARMACIST,
                "PC-998877",
                "EMP-101",
                "9876543210"
        );

        AuthResponse response = authService.registerUser(request, "127.0.0.1");
        assertNotNull(response.getToken());
        assertEquals("john.doe@pharmacy.com", response.getEmail());
        assertEquals(Role.PHARMACIST, response.getRole());
    }

    @Test
    @DisplayName("Should throw InvalidNameException when name contains digits or special characters")
    void testInvalidNameRegistration() {
        RegisterRequest request = new RegisterRequest(
                "John Doe 123",
                "john.invalid@pharmacy.com",
                "Password123!",
                Role.PHARMACIST,
                "PC-998877",
                "EMP-102",
                "9876543210"
        );

        InvalidNameException exception = assertThrows(InvalidNameException.class, () -> {
            authService.registerUser(request, "127.0.0.1");
        });

        assertEquals("Drug name must not contain special characters or numbers", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw InvalidPhoneException when mobile number is not exactly 10 digits")
    void testInvalidPhoneRegistration() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "jane.invalid@pharmacy.com",
                "Password123!",
                Role.PHARMACIST,
                "PC-998877",
                "EMP-103",
                "98765" // Only 5 digits
        );

        InvalidPhoneException exception = assertThrows(InvalidPhoneException.class, () -> {
            authService.registerUser(request, "127.0.0.1");
        });

        assertEquals("Phone Number must be exactly 10 digits long", exception.getMessage());
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void testSuccessfulLogin() {
        RegisterRequest regRequest = new RegisterRequest(
                "Doctor Smith",
                "doctor.smith@hospital.com",
                "SecurePass1!",
                Role.DOCTOR,
                "DOC-12345",
                "EMP-DOCTOR",
                "9123456789"
        );
        authService.registerUser(regRequest, "127.0.0.1");

        LoginRequest loginRequest = new LoginRequest("doctor.smith@hospital.com", "SecurePass1!");
        AuthResponse response = authService.loginUser(loginRequest, "127.0.0.1");

        assertNotNull(response.getToken());
        assertEquals("doctor.smith@hospital.com", response.getEmail());
    }

    @Test
    @DisplayName("Should throw BadCredentialsException on invalid password")
    void testInvalidPasswordLogin() {
        RegisterRequest regRequest = new RegisterRequest(
                "Store Manager",
                "manager.auth.test@hospital.com",
                "ValidPassword123!",
                Role.STORE_MANAGER,
                "MGR-8899",
                "EMP-MGR",
                "9988776655"
        );
        authService.registerUser(regRequest, "127.0.0.1");

        LoginRequest loginRequest = new LoginRequest("manager.auth.test@hospital.com", "WrongPassword!");

        assertThrows(BadCredentialsException.class, () -> {
            authService.loginUser(loginRequest, "127.0.0.1");
        });
    }
}
