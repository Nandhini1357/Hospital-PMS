package com.examly.springapp.controller;

import com.examly.springapp.dto.MedicationHistoryDTO;
import com.examly.springapp.service.MedicationHistoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Medication History", description = "Endpoints for retrieving patient medication dispensing timeline and historical records")
@RestController
@RequestMapping("/api/medication-history")
@PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST', 'ADMIN')")
public class MedicationHistoryController {

    @Autowired
    private MedicationHistoryService medicationHistoryService;

    @GetMapping
    public ResponseEntity<List<MedicationHistoryDTO>> getAllMedicationHistories() {
        return ResponseEntity.ok(medicationHistoryService.getAllMedicationHistories());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicationHistoryDTO>> getMedicationHistoryByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicationHistoryService.getMedicationHistoryByPatientId(patientId));
    }
}
