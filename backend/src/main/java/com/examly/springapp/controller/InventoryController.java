package com.examly.springapp.controller;

import com.examly.springapp.dto.*;
import com.examly.springapp.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Inventory Management", description = "Endpoints for inventory summaries, dashboard statistics, FEFO deduction, and alerts")
@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getInventorySummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<InventoryDashboardDTO> getDashboardData() {
        return ResponseEntity.ok(inventoryService.getDashboardData());
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<DrugDTO>> getLowStockAlerts() {
        return ResponseEntity.ok(inventoryService.getLowStockAlerts());
    }

    @GetMapping("/alerts/expiry")
    public ResponseEntity<List<InventoryBatchDTO>> getExpiryAlerts(@RequestParam(required = false, defaultValue = "60") Integer days) {
        return ResponseEntity.ok(inventoryService.getExpiryAlerts(days));
    }

    @GetMapping("/alerts/expired")
    public ResponseEntity<List<InventoryBatchDTO>> getExpiredBatches() {
        return ResponseEntity.ok(inventoryService.getExpiredBatches());
    }

    @PostMapping("/deduct-fefo")
    public ResponseEntity<String> deductStockFEFO(@Valid @RequestBody StockDeductionRequest request) {
        inventoryService.deductStockFEFO(request);
        return ResponseEntity.ok("Stock successfully deducted according to FEFO policy.");
    }
}
