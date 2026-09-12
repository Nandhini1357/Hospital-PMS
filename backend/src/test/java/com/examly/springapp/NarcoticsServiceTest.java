package com.examly.springapp;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.*;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.NarcoticsRegisterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class NarcoticsServiceTest {

    @Autowired
    private NarcoticsRegisterService narcoticsRegisterService;

    @Autowired
    private NarcoticsRegisterRepository registerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private DrugCategoryRepository categoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User primaryPharmacist;
    private User secondaryPharmacist;
    private User doctor;
    private User nonPharmacistPatient;
    private Drug narcoticDrug;
    private Prescription testPrescription;

    @BeforeEach
    public void setUp() {
        // Create Pharmacist Users
        primaryPharmacist = new User(null, "Pharm Primary", "pharm1@hospital.com", passwordEncoder.encode("Pass123!"), Role.PHARMACIST, "LIC-P1001", "EMP-P1", "9876543210", true);
        userRepository.save(primaryPharmacist);

        secondaryPharmacist = new User(null, "Pharm Secondary", "pharm2@hospital.com", passwordEncoder.encode("Pass123!"), Role.PHARMACIST, "LIC-P1002", "EMP-P2", "9876543211", true);
        userRepository.save(secondaryPharmacist);

        doctor = new User(null, "Dr. Alice Smith", "doc@hospital.com", passwordEncoder.encode("Pass123!"), Role.DOCTOR, "DOC-999", "EMP-D1", "9876543212", true);
        userRepository.save(doctor);

        nonPharmacistPatient = new User(null, "John Patient", "patient.narcotics.test@hospital.com", passwordEncoder.encode("Pass123!"), Role.PATIENT, "LIC-NONE", "EMP-PT1", "9876543213", true);
        userRepository.save(nonPharmacistPatient);

        // Create Controlled Drug & Category idempotently
        DrugCategory category = categoryRepository.findByNameIgnoreCase("Narcotics & Controlled")
                .orElseGet(() -> categoryRepository.save(new DrugCategory("Narcotics & Controlled", "Schedule H1 drugs")));

        narcoticDrug = drugRepository.findByCodeIgnoreCase("NR-MORPH-10")
                .orElseGet(() -> {
                    Drug d = new Drug("Morphine Sulfate 10mg TestNarcotic", "Morphine", "NR-MORPH-10", category, "Ampoule", 5, "Schedule H1 Opioid");
                    d.setIsNarcotic(true);
                    d.setIsScheduleH1(true);
                    return drugRepository.save(d);
                });

        // Create Stock Inventory & Batch
        Inventory inventory = new Inventory(narcoticDrug, 100, 5);
        inventoryRepository.save(inventory);

        InventoryBatch batch = new InventoryBatch(narcoticDrug, "BATCH-MORPH-001", 100, LocalDate.now().plusYears(1), "Cipla Pharma", "INV-999111");
        batchRepository.save(batch);

        // Create Patient & Prescription
        Patient patient = new Patient("PAT-NC-001", "Robert Paulson", 45, "MALE", "9876543210", "123 Street", "None", "Chronic Pain");
        patientRepository.save(patient);

        testPrescription = new Prescription("RX-NC-2026-001", patient, doctor, "Severe pain management");
        testPrescription.setStatus(PrescriptionStatus.VERIFIED);
        PrescriptionItem item = new PrescriptionItem(narcoticDrug, "10mg", "Q8H", "3 days", 10, "Strict controlled dosage");
        testPrescription.addItem(item);
        prescriptionRepository.save(testPrescription);
    }

    @Test
    @DisplayName("Dual-Pharmacist Authorization: Same Pharmacist Used Twice -> Reject")
    public void testSamePharmacistRejected() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(10);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setSecondaryPharmacistId(primaryPharmacist.getId()); // Same pharmacist twice

        assertThrows(SamePharmacistException.class, () -> {
            narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());
        });
    }

    @Test
    @DisplayName("Dual-Pharmacist Authorization: Missing Secondary Authorization -> Reject")
    public void testMissingSecondaryPharmacistRejected() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(10);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setSecondaryPharmacistId(null); // Missing
        request.setIsEmergencyOverride(false);

        assertThrows(DualAuthorizationRequiredException.class, () -> {
            narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());
        });
    }

    @Test
    @DisplayName("Dual-Pharmacist Authorization: Successful Dispensing")
    public void testSuccessfulDualAuthorizationDispense() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(10);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setSecondaryPharmacistId(secondaryPharmacist.getId());
        request.setPrimaryPassword("Pass123!");
        request.setSecondaryPassword("Pass123!");

        NarcoticsRegisterDTO result = narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());

        assertNotNull(result);
        assertEquals("DISPENSE", result.getTransactionType());
        assertEquals(primaryPharmacist.getId(), result.getPrimaryPharmacistId());
        assertEquals(secondaryPharmacist.getId(), result.getSecondaryPharmacistId());
        assertEquals(100, result.getOpeningBalance());
        assertEquals(90, result.getClosingBalance());
        assertNotNull(result.getVerificationHash());
        assertFalse(result.getVerificationHash().isEmpty());
    }

    @Test
    @DisplayName("Narcotic Batch & Lot-Level Traceability")
    public void testBatchTraceability() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(5);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setSecondaryPharmacistId(secondaryPharmacist.getId());

        NarcoticsRegisterDTO result = narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());

        assertEquals("BATCH-MORPH-001", result.getBatchNo());
        assertEquals("Cipla Pharma", result.getManufacturer());
        assertEquals("INV-999111", result.getSupplierInvoice());
        assertEquals("Dr. Alice Smith", result.getDoctorName());
        assertEquals("Robert Paulson", result.getPatientName());
    }

    @Test
    @DisplayName("Balance Calculation: opening_stock - dispensed + received")
    public void testBalanceCalculation() {
        NarcoticsBalanceDTO balanceBefore = narcoticsRegisterService.getBalance(narcoticDrug.getId(), null);
        assertEquals(100, balanceBefore.getPhysicalStock());

        // Perform receipt of 50 units
        NarcoticsReceiptRequestDTO receiptRequest = new NarcoticsReceiptRequestDTO();
        receiptRequest.setDrugId(narcoticDrug.getId());
        receiptRequest.setBatchNo("BATCH-MORPH-002");
        receiptRequest.setQuantity(50);
        receiptRequest.setPrimaryPharmacistId(primaryPharmacist.getId());

        narcoticsRegisterService.recordReceipt(receiptRequest, primaryPharmacist.getEmail());

        // Perform dispense of 20 units
        NarcoticsDispenseRequestDTO dispenseRequest = new NarcoticsDispenseRequestDTO();
        dispenseRequest.setPrescriptionId(testPrescription.getId());
        dispenseRequest.setDrugId(narcoticDrug.getId());
        dispenseRequest.setQuantity(20);
        dispenseRequest.setPrimaryPharmacistId(primaryPharmacist.getId());
        dispenseRequest.setSecondaryPharmacistId(secondaryPharmacist.getId());
        narcoticsRegisterService.dispenseNarcotics(dispenseRequest, primaryPharmacist.getEmail());

        NarcoticsBalanceDTO balanceAfter = narcoticsRegisterService.getBalance(narcoticDrug.getId(), null);
        assertEquals(50, balanceAfter.getTotalReceived());
        assertEquals(20, balanceAfter.getTotalDispensed());
        // Physical stock = 100 + 50 - 20 = 130
        assertEquals(130, balanceAfter.getPhysicalStock());
    }

    @Test
    @DisplayName(">2% Stock Variance Detection & Supervisor Escalation")
    public void testVarianceDetection() {
        // Physical stock is 100. Enter physical closing balance of 80 (variance 20% > 2%) without explanation -> throws exception
        NarcoticsReconciliationRequestDTO request = new NarcoticsReconciliationRequestDTO();
        request.setDrugId(narcoticDrug.getId());
        request.setPhysicalClosingBalance(80); // Expected is 0 (or baseline), physical is 80 -> >2% variance
        request.setPharmacistId(primaryPharmacist.getId());
        request.setVarianceReason(""); // Blank explanation

        assertThrows(VarianceExceededException.class, () -> {
            narcoticsRegisterService.reconcileStock(request, primaryPharmacist.getEmail());
        });

        // Providing mandatory justification reason allows saving with variance flag
        request.setVarianceReason("Ampoules broken during transport audit.");
        NarcoticsRegisterDTO reconciled = narcoticsRegisterService.reconcileStock(request, primaryPharmacist.getEmail());

        assertNotNull(reconciled);
        assertEquals("RECONCILIATION", reconciled.getTransactionType());
        assertEquals("Ampoules broken during transport audit.", reconciled.getVarianceReason());
    }

    @Test
    @DisplayName("Emergency Single-Pharmacist Override & Retrospective Approval")
    public void testEmergencyOverrideWorkflow() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(5);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setIsEmergencyOverride(true);
        request.setEmergencyReason("ICU Emergency resuscitation trauma case");

        NarcoticsRegisterDTO emergencyRecord = narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());

        assertTrue(emergencyRecord.getIsEmergencyOverride());
        assertFalse(emergencyRecord.getRetrospectiveApproved());

        // Retrospective approval by secondary senior pharmacist
        EmergencyOverrideApprovalDTO approvalDTO = new EmergencyOverrideApprovalDTO();
        approvalDTO.setApproverId(secondaryPharmacist.getId());
        approvalDTO.setApprovalNotes("Verified trauma unit order request logs.");

        NarcoticsRegisterDTO approvedRecord = narcoticsRegisterService.approveEmergencyOverride(emergencyRecord.getId(), approvalDTO, secondaryPharmacist.getEmail());

        assertTrue(approvedRecord.getRetrospectiveApproved());
        assertEquals("Pharm Secondary", approvedRecord.getRetrospectiveApprovedByName());
    }

    @Test
    @DisplayName("CDSCO Report Generation")
    public void testCDSCOReportGeneration() {
        CDSCOReportDTO report = narcoticsRegisterService.generateCDSCOReport(null);

        assertNotNull(report);
        assertNotNull(report.getReportingMonth());
        assertNotNull(report.getTransactions());
    }

    @Test
    @DisplayName("Unauthorized Access Restriction for Non-Pharmacist Role")
    public void testUnauthorizedUserAccess() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(5);
        request.setPrimaryPharmacistId(nonPharmacistPatient.getId()); // PATIENT role
        request.setIsEmergencyOverride(true);
        request.setEmergencyReason("Unauthorized test");

        assertThrows(NarcoticsUnauthorizedException.class, () -> {
            narcoticsRegisterService.dispenseNarcotics(request, nonPharmacistPatient.getEmail());
        });
    }

    @Test
    @DisplayName("Immutable Register Behavior & SHA-256 Verification Hash")
    public void testImmutableVerificationHash() {
        NarcoticsDispenseRequestDTO request = new NarcoticsDispenseRequestDTO();
        request.setPrescriptionId(testPrescription.getId());
        request.setDrugId(narcoticDrug.getId());
        request.setQuantity(2);
        request.setPrimaryPharmacistId(primaryPharmacist.getId());
        request.setSecondaryPharmacistId(secondaryPharmacist.getId());

        NarcoticsRegisterDTO result = narcoticsRegisterService.dispenseNarcotics(request, primaryPharmacist.getEmail());

        NarcoticsRegister savedEntity = registerRepository.findById(result.getId()).orElse(null);
        assertNotNull(savedEntity);
        assertNotNull(savedEntity.getVerificationHash());
        assertEquals(64, savedEntity.getVerificationHash().length()); // Valid 64-char SHA-256 hex string
    }
}
