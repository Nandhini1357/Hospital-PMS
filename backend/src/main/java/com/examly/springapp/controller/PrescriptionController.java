package com.examly.springapp.controller;

import com.examly.springapp.dto.PrescriptionDTO;
import com.examly.springapp.dto.PrescriptionStockCheckDTO;
import com.examly.springapp.service.PrescriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Prescription Management", description = "Endpoints for electronic prescription creation, editing, verification, and status management")
@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions(query, status, email));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getPendingPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getPendingPrescriptions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id, email));
    }

    @GetMapping("/number/{prescriptionNumber}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<PrescriptionDTO> getPrescriptionByNumber(@PathVariable String prescriptionNumber, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(prescriptionService.getPrescriptionByNumber(prescriptionNumber, email));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByPatientId(@PathVariable Long patientId, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId, email));
    }

    @GetMapping("/{id}/stock-check")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<PrescriptionStockCheckDTO> checkPrescriptionStock(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.checkPrescriptionStock(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> createPrescription(
            @Valid @RequestBody PrescriptionDTO dto,
            Authentication authentication) {
        String doctorEmail = authentication.getName();
        PrescriptionDTO created = prescriptionService.createPrescription(dto, doctorEmail);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionDTO dto) {
        PrescriptionDTO updated = prescriptionService.updatePrescription(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('PHARMACIST')")
    public ResponseEntity<PrescriptionDTO> verifyPrescription(@PathVariable Long id) {
        PrescriptionDTO verified = prescriptionService.verifyPrescription(id);
        return ResponseEntity.ok(verified);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<PrescriptionDTO> cancelPrescription(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        PrescriptionDTO cancelled = prescriptionService.cancelPrescription(id, reason);
        return ResponseEntity.ok(cancelled);
    }
}
