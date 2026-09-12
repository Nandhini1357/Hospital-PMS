package com.examly.springapp.dto;

import com.examly.springapp.model.POStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PurchaseOrderDTO {

    private Long id;
    private String poNumber;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private String supplierName;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private POStatus status;
    private BigDecimal totalAmount;
    private String notes;
    private Long createdById;
    private String createdByName;

    @NotEmpty(message = "At least one item is required in the Purchase Order")
    private List<PurchaseOrderItemDTO> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PurchaseOrderDTO() {}

    public PurchaseOrderDTO(Long id, String poNumber, Long supplierId, String supplierName, LocalDate orderDate, LocalDate expectedDeliveryDate, POStatus status, BigDecimal totalAmount, String notes, Long createdById, String createdByName, List<PurchaseOrderItemDTO> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.orderDate = orderDate;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.notes = notes;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public POStatus getStatus() { return status; }
    public void setStatus(POStatus status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public List<PurchaseOrderItemDTO> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemDTO> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
