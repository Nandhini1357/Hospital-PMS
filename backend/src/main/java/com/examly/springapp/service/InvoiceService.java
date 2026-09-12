package com.examly.springapp.service;

import com.examly.springapp.dto.InvoiceDTO;
import com.examly.springapp.dto.PaymentRequestDTO;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public List<InvoiceDTO> getInvoicesForPatientUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (user.getRole() == Role.FINANCE || user.getRole() == Role.ADMIN || user.getRole() == Role.STORE_MANAGER) {
            List<Invoice> allInvoices = invoiceRepository.findAll();
            if (allInvoices.isEmpty()) {
                List<Patient> allPatients = patientRepository.findAll();
                for (Patient p : allPatients) {
                    seedSampleInvoiceForPatient(p);
                }
                allInvoices = invoiceRepository.findAll();
            }
            return allInvoices.stream().map(this::mapToDTO).collect(Collectors.toList());
        }

        List<Patient> patients = getPatientsForUser(user);
        if (patients.isEmpty()) {
            return List.of();
        }

        List<Invoice> invoices = new ArrayList<>();
        for (Patient p : patients) {
            List<Invoice> pInvoices = invoiceRepository.findByPatientId(p.getId());

            // Auto-generate test/sample invoice for patient if empty so patient can test payment flow
            if (pInvoices.isEmpty()) {
                seedSampleInvoiceForPatient(p);
                pInvoices = invoiceRepository.findByPatientId(p.getId());
            }

            invoices.addAll(pInvoices);
        }

        return invoices.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public InvoiceDTO createInvoice(InvoiceDTO dto) {
        Patient patient = null;
        if (dto.getPatientId() != null) {
            patient = patientRepository.findById(dto.getPatientId()).orElse(null);
        }
        Prescription prescription = null;
        if (dto.getPrescriptionId() != null) {
            prescription = prescriptionRepository.findById(dto.getPrescriptionId()).orElse(null);
        }
        double subtotal = dto.getSubtotal() != null ? dto.getSubtotal() : 500.0;
        double gst = dto.getGstAmount() != null ? dto.getGstAmount() : Math.round(subtotal * 0.18 * 100.0) / 100.0;
        double insurance = dto.getInsuranceCoverage() != null ? dto.getInsuranceCoverage() : 0.0;
        double net = dto.getNetAmount() != null ? dto.getNetAmount() : (subtotal + gst - insurance);

        String invNum = generateInvoiceNumber();
        Invoice invoice = new Invoice(invNum, patient, prescription, subtotal, gst, insurance, net);
        if (dto.getPaymentStatus() != null) {
            invoice.setPaymentStatus(dto.getPaymentStatus());
        }
        Invoice saved = invoiceRepository.save(invoice);
        return mapToDTO(saved);
    }

    public InvoiceDTO getInvoiceByIdForUser(Long invoiceId, String userEmail) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (user.getRole() == Role.PATIENT) {
            if (!belongsToUser(invoice.getPatient(), user)) {
                throw new AccessDeniedException("Access denied: You can only access your own invoices.");
            }
        }

        return mapToDTO(invoice);
    }

    public InvoiceDTO processPatientPayment(Long invoiceId, PaymentRequestDTO requestDTO, String userEmail) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (user.getRole() == Role.PATIENT) {
            if (!belongsToUser(invoice.getPatient(), user)) {
                throw new AccessDeniedException("Access denied: You can only pay your own invoices.");
            }
        }

        if ("PAID".equalsIgnoreCase(invoice.getPaymentStatus())) {
            throw new InvalidInventoryException("Invoice " + invoice.getInvoiceNumber() + " is already fully paid.");
        }

        double payAmount = requestDTO.getAmount() != null && requestDTO.getAmount() > 0 
                ? requestDTO.getAmount() 
                : (invoice.getNetAmount() - invoice.getAmountPaid());

        double newAmountPaid = invoice.getAmountPaid() + payAmount;
        invoice.setAmountPaid(newAmountPaid);

        if (newAmountPaid >= invoice.getNetAmount() - 0.01) {
            invoice.setPaymentStatus("PAID");
        } else {
            invoice.setPaymentStatus("PARTIALLY_PAID");
        }

        String method = requestDTO.getPaymentMethod() != null ? requestDTO.getPaymentMethod() : "ONLINE_UPI";
        invoice.setPaymentMethod(method);
        invoice.setTransactionReference("TXN-DEMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setPaidAt(LocalDateTime.now());

        Invoice updated = invoiceRepository.save(invoice);
        return mapToDTO(updated);
    }

    private void seedSampleInvoiceForPatient(Patient patient) {
        List<Prescription> rxList = prescriptionRepository.findByPatientId(patient.getId());
        Prescription rx = rxList.isEmpty() ? null : rxList.get(0);

        double subtotal = 450.0;
        double gst = Math.round(subtotal * 0.18 * 100.0) / 100.0; // 18% GST
        double insurance = 100.0; // TPA Cashless Coverage
        double net = subtotal + gst - insurance;

        String invNum = generateInvoiceNumber();
        Invoice invoice = new Invoice(invNum, patient, rx, subtotal, gst, insurance, net);
        invoiceRepository.save(invoice);
    }

    private String generateInvoiceNumber() {
        int year = LocalDateTime.now().getYear();
        long count = invoiceRepository.count() + 1;
        String number = String.format("INV-%d-%05d", year, count);
        while (invoiceRepository.existsByInvoiceNumber(number)) {
            count++;
            number = String.format("INV-%d-%05d", year, count);
        }
        return number;
    }

    private List<Patient> getPatientsForUser(User user) {
        if (user == null) return List.of();
        List<Patient> patients = new ArrayList<>();

        if (user.getFullName() != null && !user.getFullName().trim().isEmpty()) {
            List<Patient> matches = patientRepository.findByFullNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(user.getFullName().trim(), "");
            for (Patient p : matches) {
                if (p.getFullName().equalsIgnoreCase(user.getFullName().trim())) {
                    patients.add(p);
                }
            }
        }

        if (user.getMobile() != null && !user.getMobile().trim().isEmpty()) {
            List<Patient> contactMatches = patientRepository.searchPatients(user.getMobile().trim());
            for (Patient p : contactMatches) {
                if (p.getContactNumber() != null && p.getContactNumber().trim().equalsIgnoreCase(user.getMobile().trim())) {
                    if (!patients.contains(p)) {
                        patients.add(p);
                    }
                }
            }
        }
        return patients;
    }

    private boolean belongsToUser(Patient patient, User user) {
        if (patient == null || user == null) return false;
        if (patient.getFullName() != null && user.getFullName() != null &&
            patient.getFullName().equalsIgnoreCase(user.getFullName())) {
            return true;
        }
        if (patient.getContactNumber() != null && user.getMobile() != null &&
            patient.getContactNumber().equalsIgnoreCase(user.getMobile())) {
            return true;
        }
        return false;
    }

    public InvoiceDTO mapToDTO(Invoice inv) {
        double balanceDue = Math.max(0.0, inv.getNetAmount() - inv.getAmountPaid());
        return new InvoiceDTO(
                inv.getId(),
                inv.getInvoiceNumber(),
                inv.getPatient() != null ? inv.getPatient().getId() : null,
                inv.getPatient() != null ? inv.getPatient().getFullName() : null,
                inv.getPatient() != null ? inv.getPatient().getPatientNumber() : null,
                inv.getPrescription() != null ? inv.getPrescription().getId() : null,
                inv.getPrescription() != null ? inv.getPrescription().getPrescriptionNumber() : "N/A",
                inv.getSubtotal(),
                inv.getGstAmount(),
                inv.getInsuranceCoverage(),
                inv.getNetAmount(),
                inv.getAmountPaid(),
                balanceDue,
                inv.getPaymentStatus(),
                inv.getPaymentMethod(),
                inv.getTransactionReference(),
                inv.getInvoiceDate(),
                inv.getPaidAt()
        );
    }
}
