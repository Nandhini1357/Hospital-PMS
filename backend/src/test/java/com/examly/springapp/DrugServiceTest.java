package com.examly.springapp;

import com.examly.springapp.dto.DrugCategoryDTO;
import com.examly.springapp.dto.DrugDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.service.DrugCategoryService;
import com.examly.springapp.service.DrugService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DrugServiceTest {

    @Autowired
    private DrugService drugService;

    @Autowired
    private DrugCategoryService categoryService;

    @Test
    @DisplayName("Should successfully create a new drug with valid details")
    void testCreateDrugSuccess() {
        DrugCategoryDTO cat = new DrugCategoryDTO();
        cat.setName("Pain Relief");
        cat.setDescription("Analgesic drugs");
        DrugCategoryDTO savedCat = categoryService.createCategory(cat);

        DrugDTO dto = new DrugDTO();
        dto.setName("Paracetamol 500mg DrugTest");
        dto.setGenericName("Acetaminophen");
        dto.setCode("DRUG-PARA-500");
        dto.setCategoryId(savedCat.getId());
        dto.setUnit("Tablet");
        dto.setReorderLevel(50);
        dto.setDescription("Standard pain reliever and fever reducer");

        DrugDTO created = drugService.createDrug(dto);
        assertNotNull(created.getId());
        assertEquals("Paracetamol 500mg DrugTest", created.getName());
        assertEquals("DRUG-PARA-500", created.getCode());
        assertEquals(50, created.getReorderLevel());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException on duplicate drug code")
    void testCreateDrugDuplicateCode() {
        DrugCategoryDTO cat = new DrugCategoryDTO();
        cat.setName("Vitamins");
        DrugCategoryDTO savedCat = categoryService.createCategory(cat);

        DrugDTO dto1 = new DrugDTO();
        dto1.setName("Vitamin C 1000mg");
        dto1.setCode("VIT-C-1000");
        dto1.setCategoryId(savedCat.getId());
        dto1.setUnit("Tablet");
        drugService.createDrug(dto1);

        DrugDTO dto2 = new DrugDTO();
        dto2.setName("Vitamin C Chewable");
        dto2.setCode("vit-c-1000"); // Same code
        dto2.setCategoryId(savedCat.getId());
        dto2.setUnit("Tablet");

        assertThrows(DuplicateResourceException.class, () -> {
            drugService.createDrug(dto2);
        });
    }

    @Test
    @DisplayName("Should search drugs by keyword")
    void testSearchDrugs() {
        DrugCategoryDTO cat = new DrugCategoryDTO();
        cat.setName("Antihistamines");
        DrugCategoryDTO savedCat = categoryService.createCategory(cat);

        DrugDTO dto = new DrugDTO();
        dto.setName("Cetirizine 10mg DrugTest");
        dto.setGenericName("Cetirizine Hydrochloride");
        dto.setCode("DRUG-CET-10");
        dto.setCategoryId(savedCat.getId());
        dto.setUnit("Tablet");
        drugService.createDrug(dto);

        List<DrugDTO> results = drugService.searchAndFilterDrugs("Cetirizine 10mg DrugTest", null);
        assertFalse(results.isEmpty());
        assertEquals("Cetirizine 10mg DrugTest", results.get(0).getName());
    }
}
