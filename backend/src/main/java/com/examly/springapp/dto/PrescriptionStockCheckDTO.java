package com.examly.springapp.dto;

import java.util.List;

public class PrescriptionStockCheckDTO {

    private Long prescriptionId;
    private String prescriptionNumber;
    private Boolean isFullyAvailable;
    private List<PrescriptionItemDTO> items;

    public PrescriptionStockCheckDTO() {}

    public PrescriptionStockCheckDTO(Long prescriptionId, String prescriptionNumber, Boolean isFullyAvailable, List<PrescriptionItemDTO> items) {
        this.prescriptionId = prescriptionId;
        this.prescriptionNumber = prescriptionNumber;
        this.isFullyAvailable = isFullyAvailable;
        this.items = items;
    }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public Boolean getIsFullyAvailable() { return isFullyAvailable; }
    public void setIsFullyAvailable(Boolean isFullyAvailable) { this.isFullyAvailable = isFullyAvailable; }

    public List<PrescriptionItemDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemDTO> items) { this.items = items; }
}
