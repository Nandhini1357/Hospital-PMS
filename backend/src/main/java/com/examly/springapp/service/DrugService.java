package com.examly.springapp.service;

import com.examly.springapp.dto.DrugDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Drug;
import com.examly.springapp.model.DrugCategory;
import com.examly.springapp.model.Inventory;
import com.examly.springapp.repository.DrugCategoryRepository;
import com.examly.springapp.repository.DrugRepository;
import com.examly.springapp.repository.InventoryBatchRepository;
import com.examly.springapp.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DrugService {

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private DrugCategoryRepository categoryRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    public List<DrugDTO> getAllDrugs() {
        return drugRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DrugDTO getDrugById(Long id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + id));
        return mapToDTO(drug);
    }

    public List<DrugDTO> searchAndFilterDrugs(String query, Long categoryId) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return drugRepository.searchDrugs(cleanQuery, categoryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DrugDTO createDrug(DrugDTO dto) {
        if (drugRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new DuplicateResourceException("Drug already exists with name: " + dto.getName());
        }
        if (drugRepository.existsByCodeIgnoreCase(dto.getCode().trim())) {
            throw new DuplicateResourceException("Drug already exists with code: " + dto.getCode());
        }

        DrugCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Drug drug = new Drug(
                dto.getName().trim(),
                dto.getGenericName(),
                dto.getCode().trim(),
                category,
                dto.getUnit(),
                dto.getReorderLevel(),
                dto.getDescription()
        );

        Drug savedDrug = drugRepository.save(drug);

        // Auto-create inventory record for new drug
        Inventory inventory = new Inventory(savedDrug, 0, savedDrug.getReorderLevel());
        inventoryRepository.save(inventory);

        return mapToDTO(savedDrug);
    }

    public DrugDTO updateDrug(Long id, DrugDTO dto) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + id));

        if (drugRepository.existsByNameIgnoreCaseAndIdNot(dto.getName().trim(), id)) {
            throw new DuplicateResourceException("Drug already exists with name: " + dto.getName());
        }
        if (drugRepository.existsByCodeIgnoreCaseAndIdNot(dto.getCode().trim(), id)) {
            throw new DuplicateResourceException("Drug already exists with code: " + dto.getCode());
        }

        DrugCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        drug.setName(dto.getName().trim());
        drug.setGenericName(dto.getGenericName());
        drug.setCode(dto.getCode().trim());
        drug.setCategory(category);
        drug.setUnit(dto.getUnit());
        drug.setReorderLevel(dto.getReorderLevel());
        drug.setDescription(dto.getDescription());

        Drug updated = drugRepository.save(drug);

        // Update reorder level in inventory summary record
        inventoryRepository.findByDrugId(id).ifPresent(inv -> {
            inv.setReorderLevel(updated.getReorderLevel());
            inventoryRepository.save(inv);
        });

        return mapToDTO(updated);
    }

    public void deleteDrug(Long id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found with id: " + id));

        inventoryRepository.findByDrugId(id).ifPresent(inventoryRepository::delete);
        drugRepository.delete(drug);
    }

    public DrugDTO mapToDTO(Drug drug) {
        Integer totalStock = batchRepository.sumAvailableQuantityByDrugId(drug.getId(), LocalDate.now());
        if (totalStock == null) {
            totalStock = 0;
        }

        return new DrugDTO(
                drug.getId(),
                drug.getName(),
                drug.getGenericName(),
                drug.getCode(),
                drug.getCategory().getId(),
                drug.getCategory().getName(),
                drug.getUnit(),
                drug.getReorderLevel(),
                drug.getDescription(),
                totalStock,
                drug.getCreatedAt(),
                drug.getUpdatedAt()
        );
    }
}
