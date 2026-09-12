package com.examly.springapp.repository;

import com.examly.springapp.model.GRNItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GRNItemRepository extends JpaRepository<GRNItem, Long> {
    List<GRNItem> findByGrnId(Long grnId);
    List<GRNItem> findByDrugId(Long drugId);
}
