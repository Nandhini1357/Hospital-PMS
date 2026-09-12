package com.examly.springapp.controller;

import com.examly.springapp.dto.MedicationHistoryDTO;
import com.examly.springapp.dto.PatientDTO;
import com.examly.springapp.service.MedicationHistoryService;
import com.examly.springapp.service.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Patient Management", description = "Endpoints for managing patient profiles and retrieving medication histories")
@RestController
@RequestMapping("/api/patients")
@PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST', 'ADMIN')")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private MedicationHistoryService medicationHistoryService;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(patientService.getAllPatients(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/number/{patientNumber}")
    public ResponseEntity<PatientDTO> getPatientByNumber(@PathVariable String patientNumber) {
        return ResponseEntity.ok(patientService.getPatientByNumber(patientNumber));
    }

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@Valid @RequestBody PatientDTO dto) {
        PatientDTO created = patientService.createPatient(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @Valid @RequestBody PatientDTO dto) {
        PatientDTO updated = patientService.updatePatient(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<MedicationHistoryDTO>> getPatientMedicationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(medicationHistoryService.getMedicationHistoryByPatientId(id));
    }
}
