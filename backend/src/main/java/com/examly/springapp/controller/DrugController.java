package com.examly.springapp.controller;

import com.examly.springapp.dto.DrugDTO;
import com.examly.springapp.service.DrugService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Drugs Management", description = "Endpoints for viewing, creating, updating, searching, and deleting drugs")
@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    @Autowired
    private DrugService drugService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER', 'DOCTOR')")
    public ResponseEntity<List<DrugDTO>> getAllDrugs() {
        return ResponseEntity.ok(drugService.getAllDrugs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER', 'DOCTOR')")
    public ResponseEntity<DrugDTO> getDrugById(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getDrugById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER', 'DOCTOR')")
    public ResponseEntity<List<DrugDTO>> searchDrugs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(drugService.searchAndFilterDrugs(query, categoryId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
    public ResponseEntity<DrugDTO> createDrug(@Valid @RequestBody DrugDTO dto) {
        DrugDTO created = drugService.createDrug(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
    public ResponseEntity<DrugDTO> updateDrug(@PathVariable Long id, @Valid @RequestBody DrugDTO dto) {
        DrugDTO updated = drugService.updateDrug(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
    public ResponseEntity<Void> deleteDrug(@PathVariable Long id) {
        drugService.deleteDrug(id);
        return ResponseEntity.noContent().build();
    }
}
