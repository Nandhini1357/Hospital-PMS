package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drug_id", nullable = false, unique = true)
    private Drug drug;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity = 0;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public Inventory() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Inventory(Drug drug, Integer totalQuantity, Integer reorderLevel) {
        this.drug = drug;
        this.totalQuantity = totalQuantity != null ? totalQuantity : 0;
        this.reorderLevel = reorderLevel != null ? reorderLevel : (drug != null ? drug.getReorderLevel() : 10);
        this.lastUpdated = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Drug getDrug() {
        return drug;
    }

    public void setDrug(Drug drug) {
        this.drug = drug;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
