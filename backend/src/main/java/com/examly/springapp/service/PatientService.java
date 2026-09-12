package com.examly.springapp.service;

import com.examly.springapp.dto.PatientDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Patient;
import com.examly.springapp.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<PatientDTO> getAllPatients(String query) {
        List<Patient> patients;
        if (query != null && !query.trim().isEmpty()) {
            patients = patientRepository.searchPatients(query.trim());
        } else {
            patients = patientRepository.findAll();
        }
        return patients.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToDTO(patient);
    }

    public PatientDTO getPatientByNumber(String patientNumber) {
        Patient patient = patientRepository.findByPatientNumber(patientNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with number: " + patientNumber));
        return mapToDTO(patient);
    }

    public PatientDTO createPatient(PatientDTO dto) {
        Patient patient = new Patient();
        patient.setFullName(dto.getFullName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setContactNumber(dto.getContactNumber());
        patient.setAddress(dto.getAddress());
        patient.setAllergies(dto.getAllergies());
        patient.setMedicalHistory(dto.getMedicalHistory());

        if (dto.getPatientNumber() != null && !dto.getPatientNumber().trim().isEmpty()) {
            patient.setPatientNumber(dto.getPatientNumber().trim());
        } else {
            patient.setPatientNumber(generatePatientNumber());
        }

        Patient saved = patientRepository.save(patient);
        return mapToDTO(saved);
    }

    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patient.setFullName(dto.getFullName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setContactNumber(dto.getContactNumber());
        patient.setAddress(dto.getAddress());
        patient.setAllergies(dto.getAllergies());
        patient.setMedicalHistory(dto.getMedicalHistory());

        Patient updated = patientRepository.save(patient);
        return mapToDTO(updated);
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    private String generatePatientNumber() {
        long count = patientRepository.count() + 1;
        String number = String.format("PAT-%05d", count);
        while (patientRepository.existsByPatientNumber(number)) {
            count++;
            number = String.format("PAT-%05d", count);
        }
        return number;
    }

    public PatientDTO mapToDTO(Patient patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getPatientNumber(),
                patient.getFullName(),
                patient.getAge(),
                patient.getGender(),
                patient.getContactNumber(),
                patient.getAddress(),
                patient.getAllergies(),
                patient.getMedicalHistory(),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }
}
