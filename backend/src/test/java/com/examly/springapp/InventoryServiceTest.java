package com.examly.springapp;

import com.examly.springapp.dto.*;
import com.examly.springapp.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class InventoryServiceTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryBatchService batchService;

    @Autowired
    private DrugService drugService;

    @Autowired
    private DrugCategoryService categoryService;

    @Test
    @DisplayName("Should detect low stock alert when total stock is at or below reorder level")
    void testLowStockAlert() {
        DrugCategoryDTO cat = categoryService.createCategory(new DrugCategoryDTO(null, "Emergency Meds", "Desc", null));

        DrugDTO drug = new DrugDTO();
        drug.setName("Epinephrine 1mg");
        drug.setCode("EPI-1MG");
        drug.setCategoryId(cat.getId());
        drug.setUnit("Ampoule");
        drug.setReorderLevel(20); // Reorder level set to 20
        DrugDTO savedDrug = drugService.createDrug(drug);

        // Add batch with only 10 units (below 20 threshold)
        InventoryBatchDTO batch = new InventoryBatchDTO();
        batch.setDrugId(savedDrug.getId());
        batch.setBatchNumber("EPI-B1");
        batch.setQuantity(10);
        batch.setUnitPrice(new BigDecimal("45.00"));
        batch.setManufacturingDate(LocalDate.now().minusDays(5));
        batch.setExpiryDate(LocalDate.now().plusMonths(12));
        batchService.addBatch(batch);

        List<DrugDTO> lowStockAlerts = inventoryService.getLowStockAlerts();
        boolean containsEpi = lowStockAlerts.stream().anyMatch(d -> d.getId().equals(savedDrug.getId()));
        assertTrue(containsEpi);
    }

    @Test
    @DisplayName("Should deduct stock following FEFO principle across multiple batches")
    void testStockDeductionFEFO() {
        DrugCategoryDTO cat = categoryService.createCategory(new DrugCategoryDTO(null, "FEFO Test Cat", "Desc", null));

        DrugDTO drug = new DrugDTO();
        drug.setName("Metformin 500mg");
        drug.setCode("MET-500");
        drug.setCategoryId(cat.getId());
        drug.setUnit("Tablet");
        DrugDTO savedDrug = drugService.createDrug(drug);

        // Batch 1: 30 units, expires in 2 months
        InventoryBatchDTO b1 = new InventoryBatchDTO();
        b1.setDrugId(savedDrug.getId());
        b1.setBatchNumber("MET-B1-EARLY");
        b1.setQuantity(30);
        b1.setUnitPrice(new BigDecimal("3.00"));
        b1.setManufacturingDate(LocalDate.now().minusDays(30));
        b1.setExpiryDate(LocalDate.now().plusMonths(2));
        batchService.addBatch(b1);

        // Batch 2: 50 units, expires in 10 months
        InventoryBatchDTO b2 = new InventoryBatchDTO();
        b2.setDrugId(savedDrug.getId());
        b2.setBatchNumber("MET-B2-LATER");
        b2.setQuantity(50);
        b2.setUnitPrice(new BigDecimal("3.00"));
        b2.setManufacturingDate(LocalDate.now().minusDays(10));
        b2.setExpiryDate(LocalDate.now().plusMonths(10));
        batchService.addBatch(b2);

        // Deduct 40 units -> should completely consume Batch 1 (30 units) and take 10 units from Batch 2
        StockDeductionRequest request = new StockDeductionRequest(savedDrug.getId(), 40);
        inventoryService.deductStockFEFO(request);

        List<InventoryBatchDTO> remainingBatches = batchService.getBatchesByDrug(savedDrug.getId());
        InventoryBatchDTO batch1Updated = remainingBatches.stream().filter(b -> b.getBatchNumber().equals("MET-B1-EARLY")).findFirst().get();
        InventoryBatchDTO batch2Updated = remainingBatches.stream().filter(b -> b.getBatchNumber().equals("MET-B2-LATER")).findFirst().get();

        assertEquals(0, batch1Updated.getQuantity()); // 30 consumed completely
        assertEquals(40, batch2Updated.getQuantity()); // 50 - 10 = 40

        DrugDTO drugAfter = drugService.getDrugById(savedDrug.getId());
        assertEquals(40, drugAfter.getTotalStock()); // 80 - 40 = 40
    }

    @Test
    @DisplayName("Should generate comprehensive Inventory Dashboard DTO")
    void testGetDashboardData() {
        InventoryDashboardDTO dashboard = inventoryService.getDashboardData();
        assertNotNull(dashboard);
        assertNotNull(dashboard.getLowStockDrugs());
        assertNotNull(dashboard.getExpiringBatches());
        assertNotNull(dashboard.getCategoryBreakdown());
    }
}
