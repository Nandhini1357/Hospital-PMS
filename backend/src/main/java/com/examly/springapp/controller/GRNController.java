package com.examly.springapp.controller;

import com.examly.springapp.dto.GRNDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.GRNService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Goods Receipt Notes (GRN)", description = "Endpoints for receiving goods and GRN tracking")
@RestController
@RequestMapping("/api/inventory/grn")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class GRNController {

    @Autowired
    private GRNService grnService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<GRNDTO>> getAllGRNs() {
        return ResponseEntity.ok(grnService.getAllGRNs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GRNDTO> getGRNById(@PathVariable Long id) {
        return ResponseEntity.ok(grnService.getGRNById(id));
    }

    @GetMapping("/po/{purchaseOrderId}")
    public ResponseEntity<List<GRNDTO>> getGRNsByPO(@PathVariable Long purchaseOrderId) {
        return ResponseEntity.ok(grnService.getGRNsByPO(purchaseOrderId));
    }

    @PostMapping
    public ResponseEntity<GRNDTO> createGRN(@Valid @RequestBody GRNDTO dto, Authentication authentication) {
        User receivedBy = null;
        if (authentication != null) {
            receivedBy = userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        GRNDTO created = grnService.createGRN(dto, receivedBy);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
