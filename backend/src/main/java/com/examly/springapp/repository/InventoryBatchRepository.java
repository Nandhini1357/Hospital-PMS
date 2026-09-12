package com.examly.springapp.repository;

import com.examly.springapp.model.BatchStatus;
import com.examly.springapp.model.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {
    List<InventoryBatch> findByDrugId(Long drugId);

    List<InventoryBatch> findByDrugIdAndBatchNumber(Long drugId, String batchNumber);

    // FEFO Logic: Get available, non-expired batches for a drug, ordered by expiry date ASC
    List<InventoryBatch> findByDrugIdAndQuantityGreaterThanAndExpiryDateAfterOrderByExpiryDateAsc(
            Long drugId, Integer quantityThreshold, LocalDate today);

    // Get all active batches sorted by FEFO order across all drugs
    List<InventoryBatch> findByExpiryDateAfterAndQuantityGreaterThanOrderByExpiryDateAsc(
            LocalDate today, Integer quantityThreshold);

    List<InventoryBatch> findByStatus(BatchStatus status);

    @Query("SELECT b FROM InventoryBatch b WHERE b.expiryDate <= :today AND b.status != 'DISCARDED'")
    List<InventoryBatch> findExpiredBatches(@Param("today") LocalDate today);

    @Query("SELECT b FROM InventoryBatch b WHERE b.expiryDate > :today AND b.expiryDate <= :targetDate AND b.status != 'DISCARDED'")
    List<InventoryBatch> findExpiringSoonBatches(@Param("today") LocalDate today, @Param("targetDate") LocalDate targetDate);

    @Query("SELECT SUM(b.quantity) FROM InventoryBatch b WHERE b.drug.id = :drugId AND b.expiryDate > :today AND b.status != 'DISCARDED'")
    Integer sumAvailableQuantityByDrugId(@Param("drugId") Long drugId, @Param("today") LocalDate today);

    @Query("SELECT SUM(b.quantity * b.unitPrice) FROM InventoryBatch b WHERE b.expiryDate > :today AND b.status != 'DISCARDED'")
    Double calculateTotalInventoryValue(@Param("today") LocalDate today);

    boolean existsByDrugIdAndBatchNumberIgnoreCase(Long drugId, String batchNumber);
}
