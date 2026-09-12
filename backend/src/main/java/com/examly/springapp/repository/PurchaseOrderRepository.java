package com.examly.springapp.repository;

import com.examly.springapp.model.POStatus;
import com.examly.springapp.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    List<PurchaseOrder> findByStatus(POStatus status);
    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
}
