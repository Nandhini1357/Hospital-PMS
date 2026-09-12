package com.examly.springapp.dto;

import com.examly.springapp.model.InspectionResult;
import java.time.LocalDateTime;

public class QualityInspectionDTO {

    private Long id;
    private Long grnId;
    private String grnNumber;
    private Long inspectedById;
    private String inspectedByName;
    private LocalDateTime inspectionDate;
    private InspectionResult status;
    private String remarks;
    private LocalDateTime createdAt;

    public QualityInspectionDTO() {}

    public QualityInspectionDTO(Long id, Long grnId, String grnNumber, Long inspectedById, String inspectedByName, LocalDateTime inspectionDate, InspectionResult status, String remarks, LocalDateTime createdAt) {
        this.id = id;
        this.grnId = grnId;
        this.grnNumber = grnNumber;
        this.inspectedById = inspectedById;
        this.inspectedByName = inspectedByName;
        this.inspectionDate = inspectionDate;
        this.status = status;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGrnId() { return grnId; }
    public void setGrnId(Long grnId) { this.grnId = grnId; }

    public String getGrnNumber() { return grnNumber; }
    public void setGrnNumber(String grnNumber) { this.grnNumber = grnNumber; }

    public Long getInspectedById() { return inspectedById; }
    public void setInspectedById(Long inspectedById) { this.inspectedById = inspectedById; }

    public String getInspectedByName() { return inspectedByName; }
    public void setInspectedByName(String inspectedByName) { this.inspectedByName = inspectedByName; }

    public LocalDateTime getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDateTime inspectionDate) { this.inspectionDate = inspectionDate; }

    public InspectionResult getStatus() { return status; }
    public void setStatus(InspectionResult status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
