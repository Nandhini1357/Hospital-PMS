package com.examly.springapp;

import com.examly.springapp.dto.DrugCategoryDTO;
import com.examly.springapp.dto.DrugDTO;
import com.examly.springapp.dto.InventoryBatchDTO;
import com.examly.springapp.exception.InvalidInventoryException;
import com.examly.springapp.service.DrugCategoryService;
import com.examly.springapp.service.DrugService;
import com.examly.springapp.service.InventoryBatchService;
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
public class InventoryBatchServiceTest {

    @Autowired
    private InventoryBatchService batchService;

    @Autowired
    private DrugService drugService;

    @Autowired
    private DrugCategoryService categoryService;

    @Test
    @DisplayName("Should successfully add a batch and update stock quantity")
    void testAddBatchSuccess() {
        DrugCategoryDTO cat = categoryService.createCategory(new DrugCategoryDTO(null, "Test Category", "Desc", null));

        DrugDTO drug = new DrugDTO();
        drug.setName("Amoxicillin 500mg TestBatch");
        drug.setCode("AMOX-500-BTCH");
        drug.setCategoryId(cat.getId());
        drug.setUnit("Capsule");
        DrugDTO savedDrug = drugService.createDrug(drug);

        InventoryBatchDTO batchDTO = new InventoryBatchDTO();
        batchDTO.setDrugId(savedDrug.getId());
        batchDTO.setBatchNumber("BATCH-2026-001");
        batchDTO.setQuantity(100);
        batchDTO.setUnitPrice(new BigDecimal("12.50"));
        batchDTO.setManufacturingDate(LocalDate.now().minusDays(10));
        batchDTO.setExpiryDate(LocalDate.now().plusMonths(12));

        InventoryBatchDTO created = batchService.addBatch(batchDTO);
        assertNotNull(created.getId());
        assertEquals("BATCH-2026-001", created.getBatchNumber());

        DrugDTO updatedDrug = drugService.getDrugById(savedDrug.getId());
        assertEquals(100, updatedDrug.getTotalStock());
    }

    @Test
    @DisplayName("Should throw InvalidInventoryException when expiry date is in the past or manufacturing date in future")
    void testInvalidBatchDates() {
        DrugCategoryDTO cat = categoryService.createCategory(new DrugCategoryDTO(null, "Cat Dates", "Desc", null));

        DrugDTO drug = new DrugDTO();
        drug.setName("Ibuprofen 400mg");
        drug.setCode("IBU-400");
        drug.setCategoryId(cat.getId());
        drug.setUnit("Tablet");
        DrugDTO savedDrug = drugService.createDrug(drug);

        InventoryBatchDTO batchDTO = new InventoryBatchDTO();
        batchDTO.setDrugId(savedDrug.getId());
        batchDTO.setBatchNumber("BATCH-INVALID-DATE");
        batchDTO.setQuantity(50);
        batchDTO.setUnitPrice(new BigDecimal("5.00"));
        batchDTO.setManufacturingDate(LocalDate.now().minusDays(10));
        batchDTO.setExpiryDate(LocalDate.now().minusDays(1)); // Expired date!

        assertThrows(InvalidInventoryException.class, () -> {
            batchService.addBatch(batchDTO);
        });
    }

    @Test
    @DisplayName("Should retrieve FEFO sorted batches (earliest expiry first)")
    void testFefoBatchOrdering() {
        DrugCategoryDTO cat = categoryService.createCategory(new DrugCategoryDTO(null, "FEFO Cat", "Desc", null));

        DrugDTO drug = new DrugDTO();
        drug.setName("Omeprazole 20mg FefoTest");
        drug.setCode("OMEP-20");
        drug.setCategoryId(cat.getId());
        drug.setUnit("Capsule");
        DrugDTO savedDrug = drugService.createDrug(drug);

        // Batch 1: Expires in 6 months
        InventoryBatchDTO b1 = new InventoryBatchDTO();
        b1.setDrugId(savedDrug.getId());
        b1.setBatchNumber("BATCH-EXP-6M");
        b1.setQuantity(50);
        b1.setUnitPrice(new BigDecimal("8.00"));
        b1.setManufacturingDate(LocalDate.now().minusDays(30));
        b1.setExpiryDate(LocalDate.now().plusMonths(6));
        batchService.addBatch(b1);

        // Batch 2: Expires in 2 months (earlier!)
        InventoryBatchDTO b2 = new InventoryBatchDTO();
        b2.setDrugId(savedDrug.getId());
        b2.setBatchNumber("BATCH-EXP-2M");
        b2.setQuantity(30);
        b2.setUnitPrice(new BigDecimal("8.00"));
        b2.setManufacturingDate(LocalDate.now().minusDays(60));
        b2.setExpiryDate(LocalDate.now().plusMonths(2));
        batchService.addBatch(b2);

        List<InventoryBatchDTO> fefoBatches = batchService.getFefoBatchesForDrug(savedDrug.getId());
        assertEquals(2, fefoBatches.size());
        assertEquals("BATCH-EXP-2M", fefoBatches.get(0).getBatchNumber()); // 2 months batch comes first!
        assertEquals("BATCH-EXP-6M", fefoBatches.get(1).getBatchNumber());
    }
}
