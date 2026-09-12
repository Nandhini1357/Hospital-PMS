package com.examly.springapp.dto;

import com.examly.springapp.model.GRNStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GRNDTO {

    private Long id;
    private String grnNumber;

    @NotNull(message = "Purchase Order ID is required")
    private Long purchaseOrderId;

    private String poNumber;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private String supplierName;
    private String invoiceNumber;
    private LocalDate receivedDate;
    private Long receivedById;
    private String receivedByName;
    private GRNStatus status;
    private String notes;

    @NotEmpty(message = "At least one GRN item is required")
    private List<GRNItemDTO> items = new ArrayList<>();

    private LocalDateTime createdAt;

    public GRNDTO() {}

    public GRNDTO(Long id, String grnNumber, Long purchaseOrderId, String poNumber, Long supplierId, String supplierName, String invoiceNumber, LocalDate receivedDate, Long receivedById, String receivedByName, GRNStatus status, String notes, List<GRNItemDTO> items, LocalDateTime createdAt) {
        this.id = id;
        this.grnNumber = grnNumber;
        this.purchaseOrderId = purchaseOrderId;
        this.poNumber = poNumber;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.invoiceNumber = invoiceNumber;
        this.receivedDate = receivedDate;
        this.receivedById = receivedById;
        this.receivedByName = receivedByName;
        this.status = status;
        this.notes = notes;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGrnNumber() { return grnNumber; }
    public void setGrnNumber(String grnNumber) { this.grnNumber = grnNumber; }

    public Long getPurchaseOrderId() { return purchaseOrderId; }
    public void setPurchaseOrderId(Long purchaseOrderId) { this.purchaseOrderId = purchaseOrderId; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public LocalDate getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDate receivedDate) { this.receivedDate = receivedDate; }

    public Long getReceivedById() { return receivedById; }
    public void setReceivedById(Long receivedById) { this.receivedById = receivedById; }

    public String getReceivedByName() { return receivedByName; }
    public void setReceivedByName(String receivedByName) { this.receivedByName = receivedByName; }

    public GRNStatus getStatus() { return status; }
    public void setStatus(GRNStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<GRNItemDTO> getItems() { return items; }
    public void setItems(List<GRNItemDTO> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
