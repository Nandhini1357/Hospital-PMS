package com.examly.springapp;

import com.examly.springapp.dto.*;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProcurementServiceTest {

    private SupplierRepository supplierRepository;
    private PurchaseOrderRepository purchaseOrderRepository;
    private GoodsReceiptNoteRepository grnRepository;
    private GRNItemRepository grnItemRepository;
    private QualityInspectionRepository qualityInspectionRepository;
    private DrugRepository drugRepository;
    private InventoryRepository inventoryRepository;
    private InventoryBatchRepository inventoryBatchRepository;
    private SecurityAuditLogRepository auditLogRepository;

    private SupplierService supplierService;
    private PurchaseOrderService purchaseOrderService;
    private GRNService grnService;
    private QualityInspectionService qualityInspectionService;

    private Supplier supplier;
    private Drug drug;
    private User user;

    @BeforeEach
    public void setUp() {
        supplierRepository = mock(SupplierRepository.class);
        purchaseOrderRepository = mock(PurchaseOrderRepository.class);
        grnRepository = mock(GoodsReceiptNoteRepository.class);
        grnItemRepository = mock(GRNItemRepository.class);
        qualityInspectionRepository = mock(QualityInspectionRepository.class);
        drugRepository = mock(DrugRepository.class);
        inventoryRepository = mock(InventoryRepository.class);
        inventoryBatchRepository = mock(InventoryBatchRepository.class);
        auditLogRepository = mock(SecurityAuditLogRepository.class);

        // Inject mocks using ReflectionTestUtils / standard setters
        supplierService = new SupplierService();
        org.springframework.test.util.ReflectionTestUtils.setField(supplierService, "supplierRepository", supplierRepository);

        purchaseOrderService = new PurchaseOrderService();
        org.springframework.test.util.ReflectionTestUtils.setField(purchaseOrderService, "purchaseOrderRepository", purchaseOrderRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(purchaseOrderService, "supplierRepository", supplierRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(purchaseOrderService, "drugRepository", drugRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(purchaseOrderService, "inventoryRepository", inventoryRepository);

        grnService = new GRNService();
        org.springframework.test.util.ReflectionTestUtils.setField(grnService, "grnRepository", grnRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(grnService, "purchaseOrderRepository", purchaseOrderRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(grnService, "supplierRepository", supplierRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(grnService, "drugRepository", drugRepository);

        qualityInspectionService = new QualityInspectionService();
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "qualityInspectionRepository", qualityInspectionRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "grnRepository", grnRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "grnItemRepository", grnItemRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "inventoryBatchRepository", inventoryBatchRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "inventoryRepository", inventoryRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "purchaseOrderRepository", purchaseOrderRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(qualityInspectionService, "auditLogRepository", auditLogRepository);

        supplier = new Supplier("Pfizer India", "Rajesh Kumar", "rajesh@pfizer.com", "9876543210", "Mumbai", "27AAAAA0000A1Z5", true);
        supplier.setId(1L);

        DrugCategory category = new DrugCategory("Analgesics", "Pain relief");
        drug = new Drug("Paracetamol 500mg", "Acetaminophen", "PCM500", category, "Tablet", 10, "Standard painkiller");
        drug.setId(10L);

        user = new User(5L, "Pharm Admin", "admin@hospital.com", "pass123", Role.PHARMACIST, "LIC-999", "EMP-100", "9942760883", true);
    }

    @Test
    @DisplayName("Supplier Master - Create and Toggle Status")
    public void testSupplierCreateAndStatusToggle() {
        when(supplierRepository.existsByNameIgnoreCase(any())).thenReturn(false);
        when(supplierRepository.save(any())).thenReturn(supplier);
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));

        SupplierDTO dto = new SupplierDTO(null, "Pfizer India", "Rajesh Kumar", "rajesh@pfizer.com", "9876543210", "Mumbai", "27AAAAA0000A1Z5", true, null);
        SupplierDTO created = supplierService.createSupplier(dto);

        assertNotNull(created);
        assertEquals("Pfizer India", created.getName());
        assertTrue(created.getIsActive());

        SupplierDTO toggled = supplierService.toggleSupplierStatus(1L, false);
        assertNotNull(toggled);
        assertFalse(toggled.getIsActive());
    }

    @Test
    @DisplayName("Purchase Order - Create Draft and Update Status")
    public void testPurchaseOrderWorkflow() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(drugRepository.findById(10L)).thenReturn(Optional.of(drug));

        PurchaseOrder po = new PurchaseOrder("PO-2026-0001", supplier, LocalDate.now().plusDays(5), POStatus.DRAFT, "Urgent order", user);
        po.setId(100L);
        po.addItem(new PurchaseOrderItem(drug, 100, BigDecimal.valueOf(25.00)));

        when(purchaseOrderRepository.save(any())).thenReturn(po);
        when(purchaseOrderRepository.findById(100L)).thenReturn(Optional.of(po));

        PurchaseOrderItemDTO itemDto = new PurchaseOrderItemDTO(null, 10L, "Paracetamol 500mg", "PCM500", 100, BigDecimal.valueOf(25.00), BigDecimal.valueOf(2500.00));
        PurchaseOrderDTO poDto = new PurchaseOrderDTO(null, null, 1L, "Pfizer India", LocalDate.now(), LocalDate.now().plusDays(5), POStatus.DRAFT, BigDecimal.valueOf(2500.00), "Urgent order", 5L, "Pharm Admin", List.of(itemDto), null, null);

        PurchaseOrderDTO created = purchaseOrderService.createPurchaseOrder(poDto, user);
        assertNotNull(created);
        assertEquals(POStatus.DRAFT, created.getStatus());

        PurchaseOrderDTO updated = purchaseOrderService.updateStatus(100L, POStatus.SENT);
        assertEquals(POStatus.SENT, updated.getStatus());
    }

    @Test
    @DisplayName("Auto PO Drafting - Generate Suggestions for Low Stock Drugs")
    public void testAutoDraftSuggestions() {
        Inventory inv = new Inventory(drug, 5, 10);
        inv.setId(50L);

        when(inventoryRepository.findAll()).thenReturn(List.of(inv));
        when(supplierRepository.findByIsActiveTrue()).thenReturn(List.of(supplier));

        List<AutoPODraftSuggestionDTO> suggestions = purchaseOrderService.getAutoDraftSuggestions();
        assertNotNull(suggestions);
        assertEquals(1, suggestions.size());
        assertEquals("Paracetamol 500mg", suggestions.get(0).getDrugName());
        assertEquals(5, suggestions.get(0).getCurrentStock());
        assertEquals(15, suggestions.get(0).getSuggestedReorderQuantity());
    }

    @Test
    @DisplayName("Quality Control - ACCEPT updates usable inventory stock")
    public void testQualityInspectionAcceptFlow() {
        PurchaseOrder po = new PurchaseOrder("PO-2026-0001", supplier, LocalDate.now().plusDays(5), POStatus.SENT, "Urgent order", user);
        po.setId(100L);

        GoodsReceiptNote grn = new GoodsReceiptNote("GRN-2026-0001", po, supplier, "INV-9988", LocalDate.now(), user, "All clear");
        grn.setId(200L);

        GRNItem grnItem = new GRNItem(null, drug, "BAT-PCM-001", LocalDate.now().plusYears(2), 100, BigDecimal.valueOf(25.00));
        grnItem.setId(300L);
        grn.addItem(grnItem);

        when(grnRepository.findById(200L)).thenReturn(Optional.of(grn));
        when(grnItemRepository.findById(300L)).thenReturn(Optional.of(grnItem));
        when(inventoryBatchRepository.findByDrugIdAndBatchNumber(10L, "BAT-PCM-001")).thenReturn(Collections.emptyList());

        Inventory inv = new Inventory(drug, 10, 10);
        when(inventoryRepository.findByDrugId(10L)).thenReturn(Optional.of(inv));
        when(qualityInspectionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        QualityInspectionRequestDTO.ItemInspectionDetail detail = new QualityInspectionRequestDTO.ItemInspectionDetail(300L, 100, 0, "");
        QualityInspectionRequestDTO req = new QualityInspectionRequestDTO(200L, InspectionResult.PASSED, "QC Passed", List.of(detail));

        QualityInspectionDTO result = qualityInspectionService.performQualityInspection(req, user);

        assertNotNull(result);
        assertEquals(InspectionResult.PASSED, result.getStatus());
        verify(inventoryBatchRepository, times(1)).save(any());
        verify(inventoryRepository, times(1)).save(any());
        assertEquals(110, inv.getTotalQuantity()); // 10 + 100 accepted = 110
    }
}
