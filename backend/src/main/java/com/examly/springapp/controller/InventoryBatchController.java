package com.examly.springapp.controller;

import com.examly.springapp.dto.InventoryBatchDTO;
import com.examly.springapp.service.InventoryBatchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Inventory Batches", description = "Endpoints for batch management, FEFO batch ordering, and batch discard operations")
@RestController
@RequestMapping("/api/inventory-batches")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class InventoryBatchController {

    @Autowired
    private InventoryBatchService batchService;

    @GetMapping
    public ResponseEntity<List<InventoryBatchDTO>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/drug/{drugId}")
    public ResponseEntity<List<InventoryBatchDTO>> getBatchesByDrug(@PathVariable Long drugId) {
        return ResponseEntity.ok(batchService.getBatchesByDrug(drugId));
    }

    @GetMapping("/drug/{drugId}/fefo")
    public ResponseEntity<List<InventoryBatchDTO>> getFefoBatchesForDrug(@PathVariable Long drugId) {
        return ResponseEntity.ok(batchService.getFefoBatchesForDrug(drugId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryBatchDTO> getBatchById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }

    @PostMapping
    public ResponseEntity<InventoryBatchDTO> addBatch(@Valid @RequestBody InventoryBatchDTO dto) {
        InventoryBatchDTO created = batchService.addBatch(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryBatchDTO> updateBatch(@PathVariable Long id, @Valid @RequestBody InventoryBatchDTO dto) {
        InventoryBatchDTO updated = batchService.updateBatch(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/discard")
    public ResponseEntity<InventoryBatchDTO> discardBatch(@PathVariable Long id) {
        InventoryBatchDTO discarded = batchService.discardBatch(id);
        return ResponseEntity.ok(discarded);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }
}
