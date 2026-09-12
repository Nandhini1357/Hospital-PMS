package com.examly.springapp.dto;

import com.examly.springapp.model.InspectionResult;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class GRNItemDTO {

    private Long id;
    private Long poItemId;

    @NotNull(message = "Drug ID is required")
    private Long drugId;

    private String drugName;
    private String drugCode;

    @NotBlank(message = "Batch number is required")
    private String batchNumber;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @NotNull(message = "Received quantity is required")
    @Min(value = 1, message = "Received quantity must be at least 1")
    private Integer receivedQuantity;

    private Integer acceptedQuantity = 0;
    private Integer rejectedQuantity = 0;
    private BigDecimal unitPrice;
    private InspectionResult inspectionStatus;
    private String rejectionReason;

    public GRNItemDTO() {}

    public GRNItemDTO(Long id, Long poItemId, Long drugId, String drugName, String drugCode, String batchNumber, LocalDate expiryDate, Integer receivedQuantity, Integer acceptedQuantity, Integer rejectedQuantity, BigDecimal unitPrice, InspectionResult inspectionStatus, String rejectionReason) {
        this.id = id;
        this.poItemId = poItemId;
        this.drugId = drugId;
        this.drugName = drugName;
        this.drugCode = drugCode;
        this.batchNumber = batchNumber;
        this.expiryDate = expiryDate;
        this.receivedQuantity = receivedQuantity;
        this.acceptedQuantity = acceptedQuantity;
        this.rejectedQuantity = rejectedQuantity;
        this.unitPrice = unitPrice;
        this.inspectionStatus = inspectionStatus;
        this.rejectionReason = rejectionReason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPoItemId() { return poItemId; }
    public void setPoItemId(Long poItemId) { this.poItemId = poItemId; }

    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }

    public Integer getAcceptedQuantity() { return acceptedQuantity; }
    public void setAcceptedQuantity(Integer acceptedQuantity) { this.acceptedQuantity = acceptedQuantity; }

    public Integer getRejectedQuantity() { return rejectedQuantity; }
    public void setRejectedQuantity(Integer rejectedQuantity) { this.rejectedQuantity = rejectedQuantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public InspectionResult getInspectionStatus() { return inspectionStatus; }
    public void setInspectionStatus(InspectionResult inspectionStatus) { this.inspectionStatus = inspectionStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
