package com.examly.springapp.service;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DispensingService {

    @Autowired
    private DispensingRecordRepository dispensingRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private MedicationHistoryRepository medicationHistoryRepository;

    @Autowired
    private SecurityAuditLogRepository auditLogRepository;

    @Autowired
    private PrescriptionService prescriptionService;

    public DispensingRecordDTO dispensePrescription(DispensingRequestDTO requestDTO, String pharmacistEmail) {
        Long prescriptionId = requestDTO.getPrescriptionId();
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + prescriptionId));

        if (prescription.getStatus() == PrescriptionStatus.DISPENSED) {
            throw new IllegalStateException("Prescription has already been dispensed.");
        }
        if (prescription.getStatus() == PrescriptionStatus.CANCELLED) {
            throw new IllegalStateException("Cannot dispense a cancelled prescription.");
        }

        User pharmacist = userRepository.findByEmail(pharmacistEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacist user not found with email: " + pharmacistEmail));

        LocalDate today = LocalDate.now();

        // 1. Pre-validation of unexpired stock across all items in prescription
        for (PrescriptionItem item : prescription.getItems()) {
            Long drugId = item.getDrug().getId();
            int requiredQty = item.getQuantity();

            List<InventoryBatch> unexpiredBatches = batchRepository
                    .findByDrugIdAndQuantityGreaterThanAndExpiryDateAfterOrderByExpiryDateAsc(drugId, 0, today);

            int availableQty = unexpiredBatches.stream().mapToInt(InventoryBatch::getQuantity).sum();
            if (availableQty < requiredQty) {
                throw new InvalidInventoryException("Cannot dispense. Insufficient unexpired stock for drug '"
                        + item.getDrug().getName() + "'. Required: " + requiredQty + ", Available: " + availableQty);
            }
        }

        // 2. Perform FEFO deduction for each item
        for (PrescriptionItem item : prescription.getItems()) {
            StockDeductionRequest deductionRequest = new StockDeductionRequest(item.getDrug().getId(), item.getQuantity());
            inventoryService.deductStockFEFO(deductionRequest);
        }

        // 3. Update Prescription status to DISPENSED
        prescription.setStatus(PrescriptionStatus.DISPENSED);
        prescriptionRepository.save(prescription);

        // 4. Create Dispensing Record
        DispensingRecord record = new DispensingRecord(
                generateDispensingNumber(),
                prescription,
                pharmacist,
                requestDTO.getNotes()
        );
        DispensingRecord savedRecord = dispensingRecordRepository.save(record);

        // 5. Save Patient Medication History for each item
        for (PrescriptionItem item : prescription.getItems()) {
            MedicationHistory history = new MedicationHistory(
                    prescription.getPatient(),
                    prescription,
                    item.getDrug(),
                    item.getDosage(),
                    item.getFrequency(),
                    item.getQuantity(),
                    LocalDateTime.now(),
                    pharmacist.getFullName(),
                    requestDTO.getNotes()
            );
            medicationHistoryRepository.save(history);
        }

        // 6. Security Audit Log
        SecurityAuditLog auditLog = new SecurityAuditLog(
                pharmacist.getId(),
                pharmacist.getEmail(),
                "MEDICATION_DISPENSED",
                "Dispensed RX " + prescription.getPrescriptionNumber() + " for Patient " + prescription.getPatient().getFullName(),
                "127.0.0.1"
        );
        auditLogRepository.save(auditLog);

        // 7. Assemble response DTO with low stock alerts
        DispensingRecordDTO responseDTO = mapToDTO(savedRecord);
        List<DrugDTO> lowStockAlerts = inventoryService.getLowStockAlerts();
        responseDTO.setLowStockAlerts(lowStockAlerts);

        return responseDTO;
    }

    public List<DispensingRecordDTO> getAllDispensingRecords() {
        List<DispensingRecord> records = dispensingRecordRepository.findAll();
        List<DispensingRecordDTO> dtos = new ArrayList<>();
        for (DispensingRecord record : records) {
            dtos.add(mapToDTO(record));
        }
        return dtos;
    }

    public DispensingRecordDTO getDispensingRecordById(Long id) {
        DispensingRecord record = dispensingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispensing record not found with id: " + id));
        return mapToDTO(record);
    }

    public DispensingRecordDTO getDispensingRecordByPrescriptionId(Long prescriptionId) {
        DispensingRecord record = dispensingRecordRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispensing record not found for prescription id: " + prescriptionId));
        return mapToDTO(record);
    }

    private String generateDispensingNumber() {
        long count = dispensingRecordRepository.count() + 1;
        String number = String.format("DSP-%05d", count);
        while (dispensingRecordRepository.findByDispensingNumber(number).isPresent()) {
            count++;
            number = String.format("DSP-%05d", count);
        }
        return number;
    }

    public DispensingRecordDTO mapToDTO(DispensingRecord r) {
        Prescription p = r.getPrescription();
        PrescriptionDTO pDTO = prescriptionService.mapToDTO(p);

        return new DispensingRecordDTO(
                r.getId(),
                r.getDispensingNumber(),
                p.getId(),
                p.getPrescriptionNumber(),
                p.getPatient() != null ? p.getPatient().getId() : null,
                p.getPatient() != null ? p.getPatient().getFullName() : null,
                p.getPatient() != null ? p.getPatient().getPatientNumber() : null,
                r.getPharmacist() != null ? r.getPharmacist().getId() : null,
                r.getPharmacist() != null ? r.getPharmacist().getFullName() : null,
                r.getDispensedAt(),
                r.getNotes(),
                pDTO.getItems()
        );
    }
}
