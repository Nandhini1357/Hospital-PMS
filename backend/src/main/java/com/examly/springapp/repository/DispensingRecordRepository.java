package com.examly.springapp.repository;

import com.examly.springapp.model.DispensingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispensingRecordRepository extends JpaRepository<DispensingRecord, Long> {

    Optional<DispensingRecord> findByDispensingNumber(String dispensingNumber);

    Optional<DispensingRecord> findByPrescriptionId(Long prescriptionId);

    List<DispensingRecord> findByPharmacistId(Long pharmacistId);
}
