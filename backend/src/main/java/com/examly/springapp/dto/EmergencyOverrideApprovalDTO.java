package com.examly.springapp.dto;

import jakarta.validation.constraints.NotNull;

public class EmergencyOverrideApprovalDTO {

    @NotNull(message = "Senior pharmacist ID is required")
    private Long approverId;

    private String digitalSig;
    private String approvalNotes;

    public EmergencyOverrideApprovalDTO() {}

    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }

    public String getDigitalSig() {
        return digitalSig;
    }

    public void setDigitalSig(String digitalSig) {
        this.digitalSig = digitalSig;
    }

    public String getApprovalNotes() {
        return approvalNotes;
    }

    public void setApprovalNotes(String approvalNotes) {
        this.approvalNotes = approvalNotes;
    }
}
