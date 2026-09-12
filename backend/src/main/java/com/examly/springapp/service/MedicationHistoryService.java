package com.examly.springapp.service;

import com.examly.springapp.dto.MedicationHistoryDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.MedicationHistory;
import com.examly.springapp.repository.MedicationHistoryRepository;
import com.examly.springapp.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicationHistoryService {

    @Autowired
    private MedicationHistoryRepository medicationHistoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<MedicationHistoryDTO> getMedicationHistoryByPatientId(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }
        List<MedicationHistory> historyList = medicationHistoryRepository.findByPatientIdOrderByDispensedDateDesc(patientId);
        return historyList.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MedicationHistoryDTO> getAllMedicationHistories() {
        return medicationHistoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .sorted((a, b) -> b.getDispensedDate().compareTo(a.getDispensedDate()))
                .collect(Collectors.toList());
    }

    public MedicationHistoryDTO mapToDTO(MedicationHistory mh) {
        return new MedicationHistoryDTO(
                mh.getId(),
                mh.getPatient() != null ? mh.getPatient().getId() : null,
                mh.getPatient() != null ? mh.getPatient().getFullName() : null,
                mh.getPatient() != null ? mh.getPatient().getPatientNumber() : null,
                mh.getPrescription() != null ? mh.getPrescription().getId() : null,
                mh.getPrescription() != null ? mh.getPrescription().getPrescriptionNumber() : null,
                mh.getDrug() != null ? mh.getDrug().getId() : null,
                mh.getDrug() != null ? mh.getDrug().getName() : null,
                mh.getDrug() != null ? mh.getDrug().getCode() : null,
                mh.getDrug() != null && mh.getDrug().getCategory() != null ? mh.getDrug().getCategory().getName() : null,
                mh.getDosage(),
                mh.getFrequency(),
                mh.getQuantityDispensed(),
                mh.getDispensedDate(),
                mh.getPharmacistName(),
                mh.getNotes()
        );
    }
}
