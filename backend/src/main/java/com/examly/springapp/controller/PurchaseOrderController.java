package com.examly.springapp.controller;

import com.examly.springapp.dto.AutoPODraftSuggestionDTO;
import com.examly.springapp.dto.PurchaseOrderDTO;
import com.examly.springapp.model.POStatus;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Purchase Orders", description = "Endpoints for managing Purchase Orders and Auto-Drafting")
@RestController
@RequestMapping("/api/purchase-orders")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getAllPurchaseOrders(@RequestParam(value = "status", required = false) POStatus status) {
        if (status != null) {
            return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByStatus(status));
        }
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @GetMapping("/auto-draft-suggestions")
    public ResponseEntity<List<AutoPODraftSuggestionDTO>> getAutoDraftSuggestions() {
        return ResponseEntity.ok(purchaseOrderService.getAutoDraftSuggestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrderById(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderDTO> createPurchaseOrder(@Valid @RequestBody PurchaseOrderDTO dto, Authentication authentication) {
        User createdBy = null;
        if (authentication != null) {
            createdBy = userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        PurchaseOrderDTO created = purchaseOrderService.createPurchaseOrder(dto, createdBy);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> updatePurchaseOrder(@PathVariable Long id, @Valid @RequestBody PurchaseOrderDTO dto) {
        PurchaseOrderDTO updated = purchaseOrderService.updatePurchaseOrder(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderDTO> updatePOStatus(@PathVariable Long id, @RequestParam("status") POStatus status) {
        PurchaseOrderDTO updated = purchaseOrderService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }
}
