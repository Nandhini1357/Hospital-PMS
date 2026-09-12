package com.examly.springapp;

import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.model.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register - Should return 201 Created on valid input")
    void testRegisterEndpointSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Pharmacist Alice",
                "alice.pharmacist@hospital.org",
                "StrongPassword123!",
                Role.PHARMACIST,
                "PHARM-777",
                "EMP-777",
                "9876500000"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("alice.pharmacist@hospital.org"))
                .andExpect(jsonPath("$.role").value("PHARMACIST"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 Bad Request when drug name has numbers")
    void testRegisterEndpointInvalidName() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Pharmacist 123",
                "invalid.name@hospital.org",
                "StrongPassword123!",
                Role.PHARMACIST,
                "PHARM-888",
                "EMP-888",
                "9876500000"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Drug name must not contain special characters or numbers"));
    }
}
