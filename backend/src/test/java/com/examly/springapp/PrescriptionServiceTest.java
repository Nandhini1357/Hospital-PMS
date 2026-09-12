package com.examly.springapp;

import com.examly.springapp.dto.*;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.DrugCategoryService;
import com.examly.springapp.service.DrugService;
import com.examly.springapp.service.PatientService;
import com.examly.springapp.service.PrescriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PrescriptionServiceTest {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DrugService drugService;

    @Autowired
    private DrugCategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private PatientDTO testPatient;
    private DrugDTO testDrug;
    private User testDoctor;

    @BeforeEach
    void setUp() {
        // Create Doctor User
        testDoctor = userRepository.findByEmail("doctor.test@hospital.com").orElseGet(() -> {
            User d = new User();
            d.setFullName("Dr. Alice Smith");
            d.setEmail("doctor.test@hospital.com");
            d.setPassword(passwordEncoder.encode("Password@123"));
            d.setRole(Role.DOCTOR);
            d.setLicenceNumber("DOC-12345");
            d.setMobile("9876543210");
            d.setIsActive(true);
            return userRepository.save(d);
        });

        // Create Patient
        PatientDTO pDto = new PatientDTO();
        pDto.setFullName("Test Patient RX");
        pDto.setAge(40);
        pDto.setGender("MALE");
        pDto.setContactNumber("9988776655");
        testPatient = patientService.createPatient(pDto);

        // Create Category & Drug
        DrugCategoryDTO catDto = new DrugCategoryDTO();
        catDto.setName("Rx Test Category");
        catDto.setDescription("Testing Category");
        DrugCategoryDTO createdCat = categoryService.createCategory(catDto);

        DrugDTO dDto = new DrugDTO();
        dDto.setName("Amoxicillin 500mg TestRx");
        dDto.setCode("AMX-500-RXTEST");
        dDto.setCategoryId(createdCat.getId());
        dDto.setUnit("Capsule");
        dDto.setReorderLevel(10);
        testDrug = drugService.createDrug(dDto);
    }

    @Test
    @DisplayName("Should create prescription successfully with PENDING status")
    void testCreatePrescriptionSuccess() {
        PrescriptionItemDTO item = new PrescriptionItemDTO();
        item.setDrugId(testDrug.getId());
        item.setDosage("500mg");
        item.setFrequency("1-0-1");
        item.setDuration("5 days");
        item.setQuantity(10);
        item.setInstructions("Take after meals");

        PrescriptionDTO rxDto = new PrescriptionDTO();
        rxDto.setPatientId(testPatient.getId());
        rxDto.setNotes("Bacterial infection treatment");
        rxDto.setItems(List.of(item));

        PrescriptionDTO created = prescriptionService.createPrescription(rxDto, testDoctor.getEmail());

        assertNotNull(created.getId());
        assertNotNull(created.getPrescriptionNumber());
        assertTrue(created.getPrescriptionNumber().startsWith("RX-"));
        assertEquals(PrescriptionStatus.PENDING, created.getStatus());
        assertEquals(1, created.getItems().size());
        assertEquals("Amoxicillin 500mg TestRx", created.getItems().get(0).getDrugName());
    }

    @Test
    @DisplayName("Should verify prescription successfully by Pharmacist")
    void testVerifyPrescriptionSuccess() {
        PrescriptionItemDTO item = new PrescriptionItemDTO();
        item.setDrugId(testDrug.getId());
        item.setDosage("500mg");
        item.setFrequency("1-0-1");
        item.setDuration("5 days");
        item.setQuantity(10);

        PrescriptionDTO rxDto = new PrescriptionDTO();
        rxDto.setPatientId(testPatient.getId());
        rxDto.setItems(List.of(item));

        PrescriptionDTO created = prescriptionService.createPrescription(rxDto, testDoctor.getEmail());

        PrescriptionDTO verified = prescriptionService.verifyPrescription(created.getId());
        assertEquals(PrescriptionStatus.VERIFIED, verified.getStatus());
    }

    @Test
    @DisplayName("Should cancel pending prescription successfully")
    void testCancelPrescriptionSuccess() {
        PrescriptionItemDTO item = new PrescriptionItemDTO();
        item.setDrugId(testDrug.getId());
        item.setDosage("500mg");
        item.setFrequency("1-0-1");
        item.setDuration("5 days");
        item.setQuantity(10);

        PrescriptionDTO rxDto = new PrescriptionDTO();
        rxDto.setPatientId(testPatient.getId());
        rxDto.setItems(List.of(item));

        PrescriptionDTO created = prescriptionService.createPrescription(rxDto, testDoctor.getEmail());

        PrescriptionDTO cancelled = prescriptionService.cancelPrescription(created.getId(), "Patient cancelled visit");
        assertEquals(PrescriptionStatus.CANCELLED, cancelled.getStatus());
        assertTrue(cancelled.getNotes().contains("Patient cancelled visit"));
    }
}
