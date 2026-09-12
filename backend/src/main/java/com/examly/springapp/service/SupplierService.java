package com.examly.springapp.service;

import com.examly.springapp.dto.SupplierDTO;
import com.examly.springapp.exception.DuplicateResourceException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Supplier;
import com.examly.springapp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        return mapToDTO(supplier);
    }

    public SupplierDTO createSupplier(SupplierDTO dto) {
        if (supplierRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new DuplicateResourceException("Supplier already exists with name: " + dto.getName());
        }
        Supplier supplier = new Supplier(
                dto.getName().trim(),
                dto.getContactPerson(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getAddress(),
                dto.getGstin(),
                dto.getIsActive() != null ? dto.getIsActive() : true
        );
        Supplier saved = supplierRepository.save(supplier);
        return mapToDTO(saved);
    }

    public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplier.setName(dto.getName().trim());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setGstin(dto.getGstin());
        if (dto.getIsActive() != null) {
            supplier.setIsActive(dto.getIsActive());
        }

        Supplier updated = supplierRepository.save(supplier);
        return mapToDTO(updated);
    }

    public SupplierDTO toggleSupplierStatus(Long id, boolean active) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        supplier.setIsActive(active);
        Supplier updated = supplierRepository.save(supplier);
        return mapToDTO(updated);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        supplierRepository.delete(supplier);
    }

    public SupplierDTO mapToDTO(Supplier supplier) {
        return new SupplierDTO(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getGstin(),
                supplier.getIsActive(),
                supplier.getCreatedAt()
        );
    }
}
