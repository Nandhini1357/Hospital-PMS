package com.examly.springapp.repository;

import com.examly.springapp.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByDrugId(Long drugId);

    @Query("SELECT i FROM Inventory i WHERE i.totalQuantity <= i.reorderLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT SUM(i.totalQuantity) FROM Inventory i")
    Long sumTotalStockQuantity();
}
