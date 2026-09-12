package com.examly.springapp;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DispensingServiceTest {

    @Autowired
    private DispensingService dispensingService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DrugService drugService;

    @Autowired
    private DrugCategoryService categoryService;

    @Autowired
    private InventoryBatchService batchService;

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private MedicationHistoryService medicationHistoryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private PatientDTO testPatient;
    private DrugDTO testDrug;
    private User testDoctor;
    private User testPharmacist;

    @BeforeEach
    void setUp() {
        // Doctor & Pharmacist Users
        testDoctor = userRepository.findByEmail("doctor.disp@hospital.com").orElseGet(() -> {
            User d = new User();
            d.setFullName("Dr. Dispense Tester");
            d.setEmail("doctor.disp@hospital.com");
            d.setPassword(passwordEncoder.encode("Password@123"));
            d.setRole(Role.DOCTOR);
            d.setLicenceNumber("DOC-9999");
            d.setMobile("9876543210");
            d.setIsActive(true);
            return userRepository.save(d);
        });

        testPharmacist = userRepository.findByEmail("pharmacist.disp@hospital.com").orElseGet(() -> {
            User p = new User();
            p.setFullName("Pharma Dispense Tester");
            p.setEmail("pharmacist.disp@hospital.com");
            p.setPassword(passwordEncoder.encode("Password@123"));
            p.setRole(Role.PHARMACIST);
            p.setLicenceNumber("PH-8888");
            p.setMobile("9123456789");
            p.setIsActive(true);
            return userRepository.save(p);
        });

        // Patient
        PatientDTO pDto = new PatientDTO();
        pDto.setFullName("Dispense Patient");
        pDto.setAge(55);
        pDto.setGender("FEMALE");
        pDto.setContactNumber("9988776655");
        testPatient = patientService.createPatient(pDto);

        // Drug & Category
        DrugCategoryDTO catDto = new DrugCategoryDTO();
        catDto.setName("Dispensing Test Category");
        catDto.setDescription("Dispense testing");
        DrugCategoryDTO cat = categoryService.createCategory(catDto);

        DrugDTO dDto = new DrugDTO();
        dDto.setName("Paracetamol 500mg DispTest");
        dDto.setCode("PCM-500-DISP");
        dDto.setCategoryId(cat.getId());
        dDto.setUnit("Tablet");
        dDto.setReorderLevel(15);
        testDrug = drugService.createDrug(dDto);
    }

    @Test
    @DisplayName("Should successfully dispense prescription using FEFO batch deduction")
    void testDispensePrescriptionFEFO() {
        // Create 2 batches:
        // Batch 1: Expiring earlier (30 days), Qty = 20
        // Batch 2: Expiring later (90 days), Qty = 30
        InventoryBatchDTO b1 = new InventoryBatchDTO();
        b1.setDrugId(testDrug.getId());
        b1.setBatchNumber("BATCH-EARLY-01");
        b1.setQuantity(20);
        b1.setManufacturingDate(LocalDate.now().minusDays(10));
        b1.setExpiryDate(LocalDate.now().plusDays(30));
        b1.setUnitPrice(BigDecimal.valueOf(2.50));
        batchService.addBatch(b1);

        InventoryBatchDTO b2 = new InventoryBatchDTO();
        b2.setDrugId(testDrug.getId());
        b2.setBatchNumber("BATCH-LATE-02");
        b2.setQuantity(30);
        b2.setManufacturingDate(LocalDate.now().minusDays(10));
        b2.setExpiryDate(LocalDate.now().plusDays(90));
        b2.setUnitPrice(BigDecimal.valueOf(2.50));
        batchService.addBatch(b2);

        // Create Prescription requiring 25 tablets
        PrescriptionItemDTO item = new PrescriptionItemDTO();
        item.setDrugId(testDrug.getId());
        item.setDosage("500mg");
        item.setFrequency("1-1-1");
        item.setDuration("8 days");
        item.setQuantity(25);

        PrescriptionDTO rx = new PrescriptionDTO();
        rx.setPatientId(testPatient.getId());
        rx.setItems(List.of(item));
        PrescriptionDTO createdRx = prescriptionService.createPrescription(rx, testDoctor.getEmail());

        // Dispense prescription
        DispensingRequestDTO dispenseReq = new DispensingRequestDTO();
        dispenseReq.setPrescriptionId(createdRx.getId());
        dispenseReq.setNotes("Dispensed fully by pharmacist");

        DispensingRecordDTO record = dispensingService.dispensePrescription(dispenseReq, testPharmacist.getEmail());

        assertNotNull(record.getId());
        assertNotNull(record.getDispensingNumber());
        assertEquals("DSP-", record.getDispensingNumber().substring(0, 4));
        assertEquals(testPatient.getFullName(), record.getPatientName());
        assertEquals(testPharmacist.getFullName(), record.getPharmacistName());

        // Check Batch stock after FEFO deduction:
        // Batch 1 (Qty 20) should be completely depleted to 0
        // Batch 2 (Qty 30) should have 25 - 20 = 5 deducted, remaining = 25
        List<InventoryBatch> batches = batchRepository.findByDrugId(testDrug.getId());
        InventoryBatch batchEarly = batches.stream().filter(b -> b.getBatchNumber().equals("BATCH-EARLY-01")).findFirst().orElseThrow();
        InventoryBatch batchLate = batches.stream().filter(b -> b.getBatchNumber().equals("BATCH-LATE-02")).findFirst().orElseThrow();

        assertEquals(0, batchEarly.getQuantity());
        assertEquals(25, batchLate.getQuantity());

        // Check Medication History
        List<MedicationHistoryDTO> histories = medicationHistoryService.getMedicationHistoryByPatientId(testPatient.getId());
        assertEquals(1, histories.size());
        assertEquals("Paracetamol 500mg DispTest", histories.get(0).getDrugName());
        assertEquals(25, histories.get(0).getQuantityDispensed());
        assertEquals(testPharmacist.getFullName(), histories.get(0).getPharmacistName());
    }

    @Test
    @DisplayName("Should throw InvalidInventoryException when stock is insufficient or expired")
    void testDispenseInsufficientStock() {
        // Create an expired batch
        InventoryBatchDTO bExp = new InventoryBatchDTO();
        bExp.setDrugId(testDrug.getId());
        bExp.setBatchNumber("BATCH-EXPIRED");
        bExp.setQuantity(50);
        bExp.setManufacturingDate(LocalDate.now().minusDays(200));
        bExp.setExpiryDate(LocalDate.now().minusDays(10));
        bExp.setUnitPrice(BigDecimal.valueOf(2.50));
        // Save expired batch directly via repository to bypass addBatch date validation
        Drug drug = drugRepository.findById(testDrug.getId()).orElseThrow();
        InventoryBatch expBatchEntity = new InventoryBatch(
                drug,
                null,
                "BATCH-EXPIRED",
                50,
                BigDecimal.valueOf(2.50),
                LocalDate.now().minusDays(200),
                LocalDate.now().minusDays(10)
        );
        batchRepository.save(expBatchEntity);

        PrescriptionItemDTO item = new PrescriptionItemDTO();
        item.setDrugId(testDrug.getId());
        item.setDosage("500mg");
        item.setFrequency("1-0-1");
        item.setDuration("5 days");
        item.setQuantity(10);

        PrescriptionDTO rx = new PrescriptionDTO();
        rx.setPatientId(testPatient.getId());
        rx.setItems(List.of(item));
        PrescriptionDTO createdRx = prescriptionService.createPrescription(rx, testDoctor.getEmail());

        DispensingRequestDTO dispenseReq = new DispensingRequestDTO(createdRx.getId(), "Test dispense");

        assertThrows(InvalidInventoryException.class, () -> {
            dispensingService.dispensePrescription(dispenseReq, testPharmacist.getEmail());
        });
    }
}
