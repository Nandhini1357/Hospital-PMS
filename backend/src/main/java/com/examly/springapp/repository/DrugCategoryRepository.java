package com.examly.springapp.repository;

import com.examly.springapp.model.DrugCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DrugCategoryRepository extends JpaRepository<DrugCategory, Long> {
    Optional<DrugCategory> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
