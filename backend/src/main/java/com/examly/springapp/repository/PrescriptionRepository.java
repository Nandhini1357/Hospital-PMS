package com.examly.springapp.repository;

import com.examly.springapp.model.Prescription;
import com.examly.springapp.model.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    boolean existsByPrescriptionNumber(String prescriptionNumber);

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByStatus(PrescriptionStatus status);

    List<Prescription> findByStatusIn(List<PrescriptionStatus> statuses);

    @Query("SELECT p FROM Prescription p WHERE LOWER(p.prescriptionNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patient.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patient.patientNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Prescription> searchPrescriptions(@Param("query") String query);
}
