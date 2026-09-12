package com.examly.springapp.repository;

import com.examly.springapp.model.MedicationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationHistoryRepository extends JpaRepository<MedicationHistory, Long> {

    List<MedicationHistory> findByPatientIdOrderByDispensedDateDesc(Long patientId);

    List<MedicationHistory> findByPrescriptionId(Long prescriptionId);

    List<MedicationHistory> findByDrugId(Long drugId);
}
