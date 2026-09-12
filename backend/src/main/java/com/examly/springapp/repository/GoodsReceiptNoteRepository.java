package com.examly.springapp.repository;

import com.examly.springapp.model.GRNStatus;
import com.examly.springapp.model.GoodsReceiptNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Long> {
    Optional<GoodsReceiptNote> findByGrnNumber(String grnNumber);
    List<GoodsReceiptNote> findByPurchaseOrderId(Long purchaseOrderId);
    List<GoodsReceiptNote> findBySupplierId(Long supplierId);
    List<GoodsReceiptNote> findByStatus(GRNStatus status);
    List<GoodsReceiptNote> findAllByOrderByCreatedAtDesc();
}
