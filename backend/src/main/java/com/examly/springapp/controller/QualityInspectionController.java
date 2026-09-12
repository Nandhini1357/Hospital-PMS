package com.examly.springapp.controller;

import com.examly.springapp.dto.QualityInspectionDTO;
import com.examly.springapp.dto.QualityInspectionRequestDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.QualityInspectionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Quality Control Inspection", description = "Endpoints for quality inspection flow of received goods")
@RestController
@RequestMapping("/api/procurement/quality-inspection")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class QualityInspectionController {

    @Autowired
    private QualityInspectionService qualityInspectionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<QualityInspectionDTO>> getAllInspections() {
        return ResponseEntity.ok(qualityInspectionService.getAllInspections());
    }

    @GetMapping("/grn/{grnId}")
    public ResponseEntity<QualityInspectionDTO> getInspectionByGrnId(@PathVariable Long grnId) {
        return ResponseEntity.ok(qualityInspectionService.getInspectionByGrnId(grnId));
    }

    @PostMapping
    public ResponseEntity<QualityInspectionDTO> performQualityInspection(@Valid @RequestBody QualityInspectionRequestDTO request, Authentication authentication) {
        User inspector = null;
        if (authentication != null) {
            inspector = userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        QualityInspectionDTO dto = qualityInspectionService.performQualityInspection(request, inspector);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
}
