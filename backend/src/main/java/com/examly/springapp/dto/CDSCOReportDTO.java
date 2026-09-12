package com.examly.springapp.dto;

import java.util.List;

public class CDSCOReportDTO {

    private String reportingMonth; // e.g. "2026-08"
    private Integer totalTransactions;
    private Integer totalDispensed;
    private Integer totalReceived;
    private Integer totalDestroyed;
    private Integer totalEmergencyOverrides;
    private Integer totalVarianceEscalations;
    private List<CDSCODrugSummaryDTO> drugSummaries;
    private List<NarcoticsRegisterDTO> transactions;

    public CDSCOReportDTO() {}

    public String getReportingMonth() {
        return reportingMonth;
    }

    public void setReportingMonth(String reportingMonth) {
        this.reportingMonth = reportingMonth;
    }

    public Integer getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Integer totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Integer getTotalDispensed() {
        return totalDispensed;
    }

    public void setTotalDispensed(Integer totalDispensed) {
        this.totalDispensed = totalDispensed;
    }

    public Integer getTotalReceived() {
        return totalReceived;
    }

    public void setTotalReceived(Integer totalReceived) {
        this.totalReceived = totalReceived;
    }

    public Integer getTotalDestroyed() {
        return totalDestroyed;
    }

    public void setTotalDestroyed(Integer totalDestroyed) {
        this.totalDestroyed = totalDestroyed;
    }

    public Integer getTotalEmergencyOverrides() {
        return totalEmergencyOverrides;
    }

    public void setTotalEmergencyOverrides(Integer totalEmergencyOverrides) {
        this.totalEmergencyOverrides = totalEmergencyOverrides;
    }

    public Integer getTotalVarianceEscalations() {
        return totalVarianceEscalations;
    }

    public void setTotalVarianceEscalations(Integer totalVarianceEscalations) {
        this.totalVarianceEscalations = totalVarianceEscalations;
    }

    public List<CDSCODrugSummaryDTO> getDrugSummaries() {
        return drugSummaries;
    }

    public void setDrugSummaries(List<CDSCODrugSummaryDTO> drugSummaries) {
        this.drugSummaries = drugSummaries;
    }

    public List<NarcoticsRegisterDTO> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<NarcoticsRegisterDTO> transactions) {
        this.transactions = transactions;
    }

    public static class CDSCODrugSummaryDTO {
        private Long drugId;
        private String drugName;
        private String drugCode;
        private String classification; // Schedule H1 or Narcotic
        private Integer openingBalance;
        private Integer totalReceived;
        private Integer totalDispensed;
        private Integer totalDestroyed;
        private Integer closingBalance;

        public CDSCODrugSummaryDTO() {}

        public Long getDrugId() {
            return drugId;
        }

        public void setDrugId(Long drugId) {
            this.drugId = drugId;
        }

        public String getDrugName() {
            return drugName;
        }

        public void setDrugName(String drugName) {
            this.drugName = drugName;
        }

        public String getDrugCode() {
            return drugCode;
        }

        public void setDrugCode(String drugCode) {
            this.drugCode = drugCode;
        }

        public String getClassification() {
            return classification;
        }

        public void setClassification(String classification) {
            this.classification = classification;
        }

        public Integer getOpeningBalance() {
            return openingBalance;
        }

        public void setOpeningBalance(Integer openingBalance) {
            this.openingBalance = openingBalance;
        }

        public Integer getTotalReceived() {
            return totalReceived;
        }

        public void setTotalReceived(Integer totalReceived) {
            this.totalReceived = totalReceived;
        }

        public Integer getTotalDispensed() {
            return totalDispensed;
        }

        public void setTotalDispensed(Integer totalDispensed) {
            this.totalDispensed = totalDispensed;
        }

        public Integer getTotalDestroyed() {
            return totalDestroyed;
        }

        public void setTotalDestroyed(Integer totalDestroyed) {
            this.totalDestroyed = totalDestroyed;
        }

        public Integer getClosingBalance() {
            return closingBalance;
        }

        public void setClosingBalance(Integer closingBalance) {
            this.closingBalance = closingBalance;
        }
    }
}
