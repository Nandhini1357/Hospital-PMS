package com.examly.springapp.controller;

import com.examly.springapp.dto.SupplierDTO;
import com.examly.springapp.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Suppliers", description = "Endpoints for managing pharmaceutical suppliers")
@RestController
@RequestMapping("/api/suppliers")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDTO> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<SupplierDTO> createSupplier(@Valid @RequestBody SupplierDTO dto) {
        SupplierDTO created = supplierService.createSupplier(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDTO> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierDTO dto) {
        SupplierDTO updated = supplierService.updateSupplier(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupplierDTO> toggleSupplierStatus(@PathVariable Long id, @RequestParam("active") boolean active) {
        SupplierDTO updated = supplierService.toggleSupplierStatus(id, active);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
