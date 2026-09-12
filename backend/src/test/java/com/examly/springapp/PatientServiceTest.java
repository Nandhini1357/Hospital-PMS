package com.examly.springapp;

import com.examly.springapp.dto.PatientDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.service.PatientService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PatientServiceTest {

    @Autowired
    private PatientService patientService;

    @Test
    @DisplayName("Should create patient successfully and auto-generate patient number")
    void testCreatePatientSuccess() {
        PatientDTO dto = new PatientDTO();
        dto.setFullName("John Doe");
        dto.setAge(45);
        dto.setGender("MALE");
        dto.setContactNumber("9876543210");
        dto.setAddress("123 Health Ave, Medical District");
        dto.setAllergies("Penicillin");
        dto.setMedicalHistory("Hypertension");

        PatientDTO created = patientService.createPatient(dto);

        assertNotNull(created.getId());
        assertNotNull(created.getPatientNumber());
        assertTrue(created.getPatientNumber().startsWith("PAT-"));
        assertEquals("John Doe", created.getFullName());
        assertEquals("Penicillin", created.getAllergies());
    }

    @Test
    @DisplayName("Should update patient details successfully")
    void testUpdatePatientSuccess() {
        PatientDTO dto = new PatientDTO();
        dto.setFullName("Jane Smith");
        dto.setAge(30);
        dto.setGender("FEMALE");
        dto.setContactNumber("9123456789");

        PatientDTO created = patientService.createPatient(dto);

        created.setFullName("Jane Smith Updated");
        created.setAllergies("Asthma");

        PatientDTO updated = patientService.updatePatient(created.getId(), created);

        assertEquals("Jane Smith Updated", updated.getFullName());
        assertEquals("Asthma", updated.getAllergies());
    }

    @Test
    @DisplayName("Should retrieve patients with search query")
    void testSearchPatients() {
        PatientDTO dto = new PatientDTO();
        dto.setFullName("Robert Brown");
        dto.setAge(50);
        dto.setGender("MALE");
        dto.setContactNumber("9988776655");
        patientService.createPatient(dto);

        List<PatientDTO> results = patientService.getAllPatients("Robert");
        assertFalse(results.isEmpty());
        assertEquals("Robert Brown", results.get(0).getFullName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for non-existing patient ID")
    void testGetPatientNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            patientService.getPatientById(999999L);
        });
    }
}
