package com.examly.springapp.repository;

import com.examly.springapp.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientNumber(String patientNumber);

    boolean existsByPatientNumber(String patientNumber);

    List<Patient> findByFullNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(String name, String number);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patientNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.contactNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Patient> searchPatients(@Param("query") String query);
}
