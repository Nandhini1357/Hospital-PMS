package com.examly.springapp.service;

import com.examly.springapp.dto.DrugCategoryDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.DrugCategory;
import com.examly.springapp.repository.DrugCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DrugCategoryService {

    @Autowired
    private DrugCategoryRepository categoryRepository;

    public List<DrugCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DrugCategoryDTO getCategoryById(Long id) {
        DrugCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug Category not found with id: " + id));
        return mapToDTO(category);
    }

    public DrugCategoryDTO createCategory(DrugCategoryDTO dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new DuplicateResourceException("Drug Category already exists with name: " + dto.getName());
        }
        DrugCategory category = new DrugCategory(dto.getName().trim(), dto.getDescription());
        DrugCategory saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    public DrugCategoryDTO updateCategory(Long id, DrugCategoryDTO dto) {
        DrugCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug Category not found with id: " + id));

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(dto.getName().trim(), id)) {
            throw new DuplicateResourceException("Drug Category already exists with name: " + dto.getName());
        }

        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        DrugCategory updated = categoryRepository.save(category);
        return mapToDTO(updated);
    }

    public void deleteCategory(Long id) {
        DrugCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    public DrugCategoryDTO mapToDTO(DrugCategory category) {
        return new DrugCategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt()
        );
    }
}
