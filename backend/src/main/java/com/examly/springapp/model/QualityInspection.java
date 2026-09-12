package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "quality_inspections")
public class QualityInspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grn_id", nullable = false)
    @NotNull(message = "GRN is required for quality inspection")
    private GoodsReceiptNote grn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inspected_by_id")
    private User inspectedBy;

    @Column(name = "inspection_date", nullable = false)
    private LocalDateTime inspectionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InspectionResult status;

    @Column(length = 500)
    private String remarks;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public QualityInspection() {
        this.inspectionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public QualityInspection(GoodsReceiptNote grn, User inspectedBy, InspectionResult status, String remarks) {
        this.grn = grn;
        this.inspectedBy = inspectedBy;
        this.inspectionDate = LocalDateTime.now();
        this.status = status;
        this.remarks = remarks;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.inspectionDate == null) {
            this.inspectionDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GoodsReceiptNote getGrn() { return grn; }
    public void setGrn(GoodsReceiptNote grn) { this.grn = grn; }

    public User getInspectedBy() { return inspectedBy; }
    public void setInspectedBy(User inspectedBy) { this.inspectedBy = inspectedBy; }

    public LocalDateTime getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDateTime inspectionDate) { this.inspectionDate = inspectionDate; }

    public InspectionResult getStatus() { return status; }
    public void setStatus(InspectionResult status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
