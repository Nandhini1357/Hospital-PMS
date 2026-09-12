package com.examly.springapp.controller;

import com.examly.springapp.dto.InvoiceDTO;
import com.examly.springapp.dto.PaymentRequestDTO;
import com.examly.springapp.service.InvoiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Patient Billing & Payments", description = "Endpoints for viewing patient invoices and processing online payments")
@RestController
@RequestMapping("/api/patient/invoices")
@PreAuthorize("hasAnyRole('PATIENT', 'ADMIN', 'FINANCE')")
public class PatientInvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getMyInvoices(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(invoiceService.getInvoicesForPatientUser(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(invoiceService.getInvoiceByIdForUser(id, userEmail));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<InvoiceDTO> payInvoice(
            @PathVariable Long id,
            @RequestBody(required = false) PaymentRequestDTO requestDTO,
            Authentication authentication) {
        String userEmail = authentication.getName();
        if (requestDTO == null) {
            requestDTO = new PaymentRequestDTO();
        }
        requestDTO.setInvoiceId(id);
        return ResponseEntity.ok(invoiceService.processPatientPayment(id, requestDTO, userEmail));
    }

    @PostMapping
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO dto) {
        return ResponseEntity.ok(invoiceService.createInvoice(dto));
    }
}
