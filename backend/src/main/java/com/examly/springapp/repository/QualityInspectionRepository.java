package com.examly.springapp.repository;

import com.examly.springapp.model.QualityInspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QualityInspectionRepository extends JpaRepository<QualityInspection, Long> {
    Optional<QualityInspection> findByGrnId(Long grnId);
    List<QualityInspection> findAllByOrderByInspectionDateDesc();
}
