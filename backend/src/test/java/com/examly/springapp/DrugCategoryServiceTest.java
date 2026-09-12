package com.examly.springapp;

import com.examly.springapp.dto.DrugCategoryDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.service.DrugCategoryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DrugCategoryServiceTest {

    @Autowired
    private DrugCategoryService categoryService;

    @Test
    @DisplayName("Should successfully create a new drug category")
    void testCreateCategorySuccess() {
        DrugCategoryDTO dto = new DrugCategoryDTO();
        dto.setName("Antibiotics");
        dto.setDescription("Antibiotic medications and anti-infectives");

        DrugCategoryDTO created = categoryService.createCategory(dto);
        assertNotNull(created.getId());
        assertEquals("Antibiotics", created.getName());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when creating category with duplicate name")
    void testCreateCategoryDuplicateName() {
        DrugCategoryDTO dto1 = new DrugCategoryDTO();
        dto1.setName("Analgesics");
        dto1.setDescription("Painkillers");
        categoryService.createCategory(dto1);

        DrugCategoryDTO dto2 = new DrugCategoryDTO();
        dto2.setName("analgesics"); // Case insensitive check
        dto2.setDescription("Pain relievers");

        assertThrows(DuplicateResourceException.class, () -> {
            categoryService.createCategory(dto2);
        });
    }

    @Test
    @DisplayName("Should retrieve all categories")
    void testGetAllCategories() {
        DrugCategoryDTO dto1 = new DrugCategoryDTO();
        dto1.setName("Cardio Care Test");
        categoryService.createCategory(dto1);

        DrugCategoryDTO dto2 = new DrugCategoryDTO();
        dto2.setName("Derma Care Test");
        categoryService.createCategory(dto2);

        List<DrugCategoryDTO> categories = categoryService.getAllCategories();
        assertTrue(categories.size() >= 2);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for non-existing category ID")
    void testGetCategoryNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            categoryService.getCategoryById(99999L);
        });
    }
}
