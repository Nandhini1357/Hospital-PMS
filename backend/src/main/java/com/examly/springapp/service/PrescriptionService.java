package com.examly.springapp.service;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    public List<PrescriptionDTO> getAllPrescriptions(String query, String status) {
        return getAllPrescriptions(query, status, null);
    }

    public List<PrescriptionDTO> getAllPrescriptions(String query, String status, String userEmail) {
        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        List<Prescription> prescriptions;

        if (status != null && !status.trim().isEmpty()) {
            try {
                PrescriptionStatus prescriptionStatus = PrescriptionStatus.valueOf(status.trim().toUpperCase());
                prescriptions = prescriptionRepository.findByStatus(prescriptionStatus);
            } catch (IllegalArgumentException e) {
                prescriptions = prescriptionRepository.findAll();
            }
        } else if (query != null && !query.trim().isEmpty()) {
            prescriptions = prescriptionRepository.searchPrescriptions(query.trim());
        } else {
            prescriptions = prescriptionRepository.findAll();
        }

        if (user != null && user.getRole() == Role.PATIENT) {
            prescriptions = prescriptions.stream()
                    .filter(p -> belongsToPatient(p, user))
                    .collect(Collectors.toList());
        }

        return prescriptions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getPendingPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findByStatusIn(
                List.of(PrescriptionStatus.PENDING, PrescriptionStatus.VERIFIED)
        );
        return prescriptions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public PrescriptionDTO getPrescriptionById(Long id) {
        return getPrescriptionById(id, null);
    }

    public PrescriptionDTO getPrescriptionById(Long id, String userEmail) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        if (user != null && user.getRole() == Role.PATIENT) {
            if (!belongsToPatient(prescription, user)) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You can only view your own prescriptions.");
            }
        }

        return mapToDTO(prescription);
    }

    public PrescriptionDTO getPrescriptionByNumber(String prescriptionNumber) {
        return getPrescriptionByNumber(prescriptionNumber, null);
    }

    public PrescriptionDTO getPrescriptionByNumber(String prescriptionNumber, String userEmail) {
        Prescription prescription = prescriptionRepository.findByPrescriptionNumber(prescriptionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with number: " + prescriptionNumber));

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        if (user != null && user.getRole() == Role.PATIENT) {
            if (!belongsToPatient(prescription, user)) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You can only view your own prescriptions.");
            }
        }

        return mapToDTO(prescription);
    }

    public List<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId) {
        return getPrescriptionsByPatientId(patientId, null);
    }

    public List<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId, String userEmail) {
        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        if (user != null && user.getRole() == Role.PATIENT) {
            Patient requestedPatient = patientRepository.findById(patientId).orElse(null);
            if (requestedPatient == null || !belongsToPatient(requestedPatient, user)) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You can only view your own prescriptions.");
            }
        }

        return prescriptionRepository.findByPatientId(patientId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private boolean belongsToPatient(Prescription prescription, User user) {
        if (prescription == null || prescription.getPatient() == null) return false;
        return belongsToPatient(prescription.getPatient(), user);
    }

    private boolean belongsToPatient(Patient patient, User user) {
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

    public PrescriptionDTO createPrescription(PrescriptionDTO dto, String doctorEmail) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor user not found with email: " + doctorEmail));

        Prescription prescription = new Prescription();
        prescription.setPrescriptionNumber(generatePrescriptionNumber());
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setNotes(dto.getNotes());
        prescription.setStatus(PrescriptionStatus.PENDING);

        for (PrescriptionItemDTO itemDTO : dto.getItems()) {
            Drug drug = drugRepository.findById(itemDTO.getDrugId())
                    .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + itemDTO.getDrugId()));

            PrescriptionItem item = new PrescriptionItem(
                    drug,
                    itemDTO.getDosage(),
                    itemDTO.getFrequency(),
                    itemDTO.getDuration(),
                    itemDTO.getQuantity(),
                    itemDTO.getInstructions()
            );
            prescription.addItem(item);
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return mapToDTO(saved);
    }

    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO dto) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        if (prescription.getStatus() == PrescriptionStatus.DISPENSED) {
            throw new IllegalStateException("Cannot edit a prescription that has already been dispensed.");
        }

        if (dto.getPatientId() != null) {
            Patient patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));
            prescription.setPatient(patient);
        }

        prescription.setNotes(dto.getNotes());
        prescription.getItems().clear();

        for (PrescriptionItemDTO itemDTO : dto.getItems()) {
            Drug drug = drugRepository.findById(itemDTO.getDrugId())
                    .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + itemDTO.getDrugId()));

            PrescriptionItem item = new PrescriptionItem(
                    drug,
                    itemDTO.getDosage(),
                    itemDTO.getFrequency(),
                    itemDTO.getDuration(),
                    itemDTO.getQuantity(),
                    itemDTO.getInstructions()
            );
            prescription.addItem(item);
        }

        Prescription updated = prescriptionRepository.save(prescription);
        return mapToDTO(updated);
    }

    public PrescriptionDTO verifyPrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        if (prescription.getStatus() == PrescriptionStatus.DISPENSED) {
            throw new IllegalStateException("Prescription is already dispensed.");
        }
        if (prescription.getStatus() == PrescriptionStatus.CANCELLED) {
            throw new IllegalStateException("Cannot verify a cancelled prescription.");
        }

        prescription.setStatus(PrescriptionStatus.VERIFIED);
        Prescription updated = prescriptionRepository.save(prescription);
        return mapToDTO(updated);
    }

    public PrescriptionDTO cancelPrescription(Long id, String reason) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        if (prescription.getStatus() == PrescriptionStatus.DISPENSED) {
            throw new IllegalStateException("Cannot cancel an already dispensed prescription.");
        }

        prescription.setStatus(PrescriptionStatus.CANCELLED);
        if (reason != null && !reason.trim().isEmpty()) {
            String currentNotes = prescription.getNotes() != null ? prescription.getNotes() : "";
            prescription.setNotes((currentNotes + " [Cancelled: " + reason + "]").trim());
        }

        Prescription updated = prescriptionRepository.save(prescription);
        return mapToDTO(updated);
    }

    public PrescriptionStockCheckDTO checkPrescriptionStock(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + prescriptionId));

        LocalDate today = LocalDate.now();
        boolean allAvailable = true;
        List<PrescriptionItemDTO> itemDTOs = new ArrayList<>();

        for (PrescriptionItem item : prescription.getItems()) {
            Long drugId = item.getDrug().getId();
            Integer availableStock = batchRepository.sumAvailableQuantityByDrugId(drugId, today);
            if (availableStock == null) availableStock = 0;

            boolean sufficient = availableStock >= item.getQuantity();
            if (!sufficient) allAvailable = false;

            PrescriptionItemDTO itemDTO = mapItemToDTO(item);
            itemDTO.setAvailableStock(availableStock);
            itemDTO.setIsStockSufficient(sufficient);
            itemDTOs.add(itemDTO);
        }

        return new PrescriptionStockCheckDTO(
                prescription.getId(),
                prescription.getPrescriptionNumber(),
                allAvailable,
                itemDTOs
        );
    }

    private String generatePrescriptionNumber() {
        int year = LocalDate.now().getYear();
        long count = prescriptionRepository.count() + 1;
        String number = String.format("RX-%d-%04d", year, count);
        while (prescriptionRepository.existsByPrescriptionNumber(number)) {
            count++;
            number = String.format("RX-%d-%04d", year, count);
        }
        return number;
    }

    public PrescriptionDTO mapToDTO(Prescription p) {
        LocalDate today = LocalDate.now();
        List<PrescriptionItemDTO> itemDTOs = p.getItems().stream().map(item -> {
            PrescriptionItemDTO dto = mapItemToDTO(item);
            Integer stock = batchRepository.sumAvailableQuantityByDrugId(item.getDrug().getId(), today);
            if (stock == null) stock = 0;
            dto.setAvailableStock(stock);
            dto.setIsStockSufficient(stock >= item.getQuantity());
            return dto;
        }).collect(Collectors.toList());

        return new PrescriptionDTO(
                p.getId(),
                p.getPrescriptionNumber(),
                p.getPatient() != null ? p.getPatient().getId() : null,
                p.getPatient() != null ? p.getPatient().getFullName() : null,
                p.getPatient() != null ? p.getPatient().getPatientNumber() : null,
                p.getDoctor() != null ? p.getDoctor().getId() : null,
                p.getDoctor() != null ? p.getDoctor().getFullName() : null,
                p.getStatus(),
                p.getNotes(),
                itemDTOs,
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }

    private PrescriptionItemDTO mapItemToDTO(PrescriptionItem item) {
        return new PrescriptionItemDTO(
                item.getId(),
                item.getDrug() != null ? item.getDrug().getId() : null,
                item.getDrug() != null ? item.getDrug().getName() : null,
                item.getDrug() != null ? item.getDrug().getCode() : null,
                item.getDrug() != null && item.getDrug().getCategory() != null ? item.getDrug().getCategory().getName() : null,
                item.getDrug() != null ? item.getDrug().getUnit() : null,
                item.getDosage(),
                item.getFrequency(),
                item.getDuration(),
                item.getQuantity(),
                item.getInstructions()
        );
    }
}
