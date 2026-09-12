package com.examly.springapp.repository;

import com.examly.springapp.model.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Long> {
    Optional<Drug> findByCodeIgnoreCase(String code);
    Optional<Drug> findByNameIgnoreCase(String name);

    boolean existsByCodeIgnoreCase(String code);
    boolean existsByNameIgnoreCase(String name);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    List<Drug> findByCategoryId(Long categoryId);

    @Query("SELECT d FROM Drug d WHERE " +
           "(:query IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.genericName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryId IS NULL OR d.category.id = :categoryId)")
    List<Drug> searchDrugs(@Param("query") String query, @Param("categoryId") Long categoryId);

    @Query("SELECT d.category.name, COUNT(d) FROM Drug d GROUP BY d.category.name")
    List<Object[]> countDrugsByCategory();
}
