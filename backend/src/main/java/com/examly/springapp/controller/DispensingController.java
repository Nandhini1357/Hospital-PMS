package com.examly.springapp.controller;

import com.examly.springapp.dto.DispensingRecordDTO;
import com.examly.springapp.dto.DispensingRequestDTO;
import com.examly.springapp.service.DispensingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Dispensing Management", description = "Endpoints for FEFO medication dispensing execution and audit record retrieval")
@RestController
@RequestMapping("/api/dispensing")
@PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
public class DispensingController {

    @Autowired
    private DispensingService dispensingService;

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST')")
    public ResponseEntity<DispensingRecordDTO> dispensePrescription(
            @Valid @RequestBody DispensingRequestDTO requestDTO,
            Authentication authentication) {
        String pharmacistEmail = authentication.getName();
        DispensingRecordDTO record = dispensingService.dispensePrescription(requestDTO, pharmacistEmail);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DispensingRecordDTO>> getAllDispensingRecords() {
        return ResponseEntity.ok(dispensingService.getAllDispensingRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DispensingRecordDTO> getDispensingRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(dispensingService.getDispensingRecordById(id));
    }

    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<DispensingRecordDTO> getDispensingRecordByPrescriptionId(@PathVariable Long prescriptionId) {
        return ResponseEntity.ok(dispensingService.getDispensingRecordByPrescriptionId(prescriptionId));
    }
}
