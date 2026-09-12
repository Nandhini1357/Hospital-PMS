package com.examly.springapp.repository;

import com.examly.springapp.model.NarcoticsRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NarcoticsRegisterRepository extends JpaRepository<NarcoticsRegister, Long> {

    List<NarcoticsRegister> findByDrugIdOrderByTimestampDesc(Long drugId);

    List<NarcoticsRegister> findByDrugIdAndBatchNoOrderByTimestampDesc(Long drugId, String batchNo);

    Optional<NarcoticsRegister> findTopByDrugIdOrderByTimestampDesc(Long drugId);

    Optional<NarcoticsRegister> findTopByDrugIdAndBatchNoOrderByTimestampDesc(Long drugId, String batchNo);

    List<NarcoticsRegister> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

    @Query("SELECT n FROM NarcoticsRegister n WHERE " +
           "(:drugId IS NULL OR n.drug.id = :drugId) AND " +
           "(:batchNo IS NULL OR LOWER(n.batchNo) LIKE LOWER(CONCAT('%', :batchNo, '%'))) AND " +
           "(:transactionType IS NULL OR n.transactionType = :transactionType) AND " +
           "(:startDate IS NULL OR n.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR n.timestamp <= :endDate) " +
           "ORDER BY n.timestamp DESC")
    List<NarcoticsRegister> searchRegister(
            @Param("drugId") Long drugId,
            @Param("batchNo") String batchNo,
            @Param("transactionType") String transactionType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COALESCE(SUM(n.quantity), 0) FROM NarcoticsRegister n WHERE n.drug.id = :drugId AND n.transactionType = :transactionType")
    Integer sumQuantityByDrugIdAndTransactionType(@Param("drugId") Long drugId, @Param("transactionType") String transactionType);

    @Query("SELECT COALESCE(SUM(n.quantity), 0) FROM NarcoticsRegister n WHERE n.drug.id = :drugId AND n.batchNo = :batchNo AND n.transactionType = :transactionType")
    Integer sumQuantityByDrugIdAndBatchNoAndTransactionType(@Param("drugId") Long drugId, @Param("batchNo") String batchNo, @Param("transactionType") String transactionType);
}
