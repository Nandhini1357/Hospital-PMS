package com.examly.springapp.controller;

import com.examly.springapp.dto.DrugCategoryDTO;
import com.examly.springapp.service.DrugCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Drug Categories", description = "Endpoints for managing drug categories")
@RestController
@RequestMapping("/api/categories")
@PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'STORE_MANAGER')")
public class DrugCategoryController {

    @Autowired
    private DrugCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<DrugCategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrugCategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<DrugCategoryDTO> createCategory(@Valid @RequestBody DrugCategoryDTO dto) {
        DrugCategoryDTO created = categoryService.createCategory(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugCategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody DrugCategoryDTO dto) {
        DrugCategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
