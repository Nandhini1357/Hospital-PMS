package com.examly.springapp.dto;

import com.examly.springapp.model.InspectionResult;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class QualityInspectionRequestDTO {

    @NotNull(message = "GRN ID is required")
    private Long grnId;

    @NotNull(message = "Overall inspection result is required")
    private InspectionResult result;

    private String remarks;

    private List<ItemInspectionDetail> itemInspections = new ArrayList<>();

    public static class ItemInspectionDetail {
        private Long grnItemId;
        private Integer acceptedQuantity;
        private Integer rejectedQuantity;
        private String rejectionReason;

        public ItemInspectionDetail() {}

        public ItemInspectionDetail(Long grnItemId, Integer acceptedQuantity, Integer rejectedQuantity, String rejectionReason) {
            this.grnItemId = grnItemId;
            this.acceptedQuantity = acceptedQuantity;
            this.rejectedQuantity = rejectedQuantity;
            this.rejectionReason = rejectionReason;
        }

        public Long getGrnItemId() { return grnItemId; }
        public void setGrnItemId(Long grnItemId) { this.grnItemId = grnItemId; }

        public Integer getAcceptedQuantity() { return acceptedQuantity; }
        public void setAcceptedQuantity(Integer acceptedQuantity) { this.acceptedQuantity = acceptedQuantity; }

        public Integer getRejectedQuantity() { return rejectedQuantity; }
        public void setRejectedQuantity(Integer rejectedQuantity) { this.rejectedQuantity = rejectedQuantity; }

        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    }

    public QualityInspectionRequestDTO() {}

    public QualityInspectionRequestDTO(Long grnId, InspectionResult result, String remarks, List<ItemInspectionDetail> itemInspections) {
        this.grnId = grnId;
        this.result = result;
        this.remarks = remarks;
        this.itemInspections = itemInspections != null ? itemInspections : new ArrayList<>();
    }

    public Long getGrnId() { return grnId; }
    public void setGrnId(Long grnId) { this.grnId = grnId; }

    public InspectionResult getResult() { return result; }
    public void setResult(InspectionResult result) { this.result = result; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public List<ItemInspectionDetail> getItemInspections() { return itemInspections; }
    public void setItemInspections(List<ItemInspectionDetail> itemInspections) { this.itemInspections = itemInspections; }
}
