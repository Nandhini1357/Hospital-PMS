package com.examly.springapp.repository;

import com.examly.springapp.model.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {

    List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);

    List<PrescriptionItem> findByDrugId(Long drugId);
}
