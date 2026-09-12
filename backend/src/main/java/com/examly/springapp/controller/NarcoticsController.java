package com.examly.springapp.controller;

import com.examly.springapp.dto.*;
import com.examly.springapp.service.NarcoticsRegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/narcotics")
@CrossOrigin(origins = "*")
public class NarcoticsController {

    @Autowired
    private NarcoticsRegisterService narcoticsRegisterService;

    @GetMapping("/register")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<List<NarcoticsRegisterDTO>> getRegister(
            @RequestParam(required = false) Long drugId,
            @RequestParam(required = false) String batchNo,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<NarcoticsRegisterDTO> register = narcoticsRegisterService.searchRegister(drugId, batchNo, transactionType, startDate, endDate);
        return ResponseEntity.ok(register);
    }

    @PostMapping("/dispense")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<NarcoticsRegisterDTO> dispenseNarcotics(@Valid @RequestBody NarcoticsDispenseRequestDTO requestDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "system@hpms.com";
        NarcoticsRegisterDTO record = narcoticsRegisterService.dispenseNarcotics(requestDTO, currentUserEmail);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }

    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<NarcoticsBalanceDTO> getBalance(
            @RequestParam Long drugId,
            @RequestParam(required = false) String batchNo) {
        NarcoticsBalanceDTO balance = narcoticsRegisterService.getBalance(drugId, batchNo);
        return ResponseEntity.ok(balance);
    }

    @GetMapping("/report")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<CDSCOReportDTO> getCDSCOReport(@RequestParam(required = false) String month) {
        CDSCOReportDTO report = narcoticsRegisterService.generateCDSCOReport(month);
        return ResponseEntity.ok(report);
    }

    @PostMapping("/reconcile")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<NarcoticsRegisterDTO> reconcileStock(@Valid @RequestBody NarcoticsReconciliationRequestDTO requestDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "system@hpms.com";
        NarcoticsRegisterDTO record = narcoticsRegisterService.reconcileStock(requestDTO, currentUserEmail);
        return ResponseEntity.ok(record);
    }

    @PostMapping("/receipt")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<NarcoticsRegisterDTO> recordReceipt(@Valid @RequestBody NarcoticsReceiptRequestDTO requestDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "system@hpms.com";
        NarcoticsRegisterDTO record = narcoticsRegisterService.recordReceipt(requestDTO, currentUserEmail);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }

    @PostMapping("/destruction")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<NarcoticsRegisterDTO> recordDestruction(@Valid @RequestBody NarcoticsDestructionRequestDTO requestDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "system@hpms.com";
        NarcoticsRegisterDTO record = narcoticsRegisterService.recordDestruction(requestDTO, currentUserEmail);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/approve-override")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'STORE_MANAGER', 'ADMIN')")
    public ResponseEntity<NarcoticsRegisterDTO> approveEmergencyOverride(
            @PathVariable Long id,
            @Valid @RequestBody EmergencyOverrideApprovalDTO approvalDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "system@hpms.com";
        NarcoticsRegisterDTO record = narcoticsRegisterService.approveEmergencyOverride(id, approvalDTO, currentUserEmail);
        return ResponseEntity.ok(record);
    }
}
