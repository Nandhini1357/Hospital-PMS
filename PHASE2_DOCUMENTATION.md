# Hospital Pharmacy Management System (HPMS) - Phase 2 Documentation
## Drug Master Catalog & FEFO Inventory Management

---

## 1. Overview
Phase 2 implements the **Drug Master Catalog** and **FEFO (First Expire, First Out) Inventory Management** system for HPMS.

### Key Capabilities
1. **Drug Master Catalog**: Full CRUD management of drug categories and medications (name, generic name, SKU code, category, unit, reorder level, description).
2. **Supplier Directory**: Management of drug manufacturers and distributors.
3. **FEFO Inventory & Batch Tracking**: Batch-level inventory management with manufacturing date, expiry date, quantity, unit price, and FEFO sorting (`expiry_date ASC`).
4. **Automated Stock Synchronization**: Real-time stock summation from active unexpired batches into drug inventory records.
5. **Low Stock Alerts**: Safety threshold tracking whenever total stock drops to or below the reorder level.
6. **Expiry Risk Alerts**: Proactive identification of batches expiring within 30, 60, or 90 days, or already expired.
7. **Role-Based Access Control (RBAC)**: Secured endpoints accessible only to `ADMIN`, `PHARMACIST`, and `STORE_MANAGER`.

---

## 2. Database Schema (MySQL & JPA)

### Entity Relationship Diagram (ERD Summary)
- `drug_categories` (1) ─── (N) `drugs`
- `drugs` (1) ─── (1) `inventory`
- `drugs` (1) ─── (N) `inventory_batches`
- `suppliers` (1) ─── (N) `inventory_batches`

### Tables Detail

#### `drug_categories`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Category ID |
| `name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Category Name |
| `description` | `VARCHAR(500)` | `NULLABLE` | Category details |
| `created_at` | `DATETIME` | `NOT NULL` | Record creation timestamp |

#### `suppliers`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Supplier ID |
| `name` | `VARCHAR(150)` | `NOT NULL` | Vendor/Manufacturer Name |
| `contact_person`| `VARCHAR(100)` | `NULLABLE` | Contact representative |
| `email` | `VARCHAR(100)` | `NULLABLE` | Email address |
| `phone` | `VARCHAR(20)` | `NULLABLE` | Phone number |
| `address` | `VARCHAR(255)` | `NULLABLE` | Vendor address |
| `created_at` | `DATETIME` | `NOT NULL` | Creation timestamp |

#### `drugs`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Drug ID |
| `name` | `VARCHAR(150)` | `NOT NULL`, `UNIQUE` | Drug Commercial Name |
| `generic_name` | `VARCHAR(150)` | `NULLABLE` | Generic compound name |
| `code` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | Unique SKU / Barcode |
| `category_id` | `BIGINT` | `FOREIGN KEY` -> `drug_categories(id)` | Category link |
| `unit` | `VARCHAR(50)` | `NOT NULL` | Unit (Tablet, Syrup, Injection, etc.) |
| `reorder_level`| `INT` | `NOT NULL`, `DEFAULT 10` | Safety reorder threshold |
| `description` | `VARCHAR(500)` | `NULLABLE` | Instructions / dosage guidelines |
| `created_at` | `DATETIME` | `NOT NULL` | Creation timestamp |
| `updated_at` | `DATETIME` | `NOT NULL` | Update timestamp |

#### `inventory`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Inventory record ID |
| `drug_id` | `BIGINT` | `FOREIGN KEY`, `UNIQUE` -> `drugs(id)` | Associated drug |
| `total_quantity`| `INT` | `NOT NULL`, `DEFAULT 0` | Calculated active stock |
| `reorder_level`| `INT` | `NOT NULL` | Reorder threshold |
| `last_updated` | `DATETIME` | `NOT NULL` | Last sync timestamp |

#### `inventory_batches`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Batch ID |
| `drug_id` | `BIGINT` | `FOREIGN KEY` -> `drugs(id)` | Drug link |
| `supplier_id` | `BIGINT` | `FOREIGN KEY` -> `suppliers(id)` | Supplier link (optional) |
| `batch_number` | `VARCHAR(100)` | `NOT NULL` | Lot/Batch code |
| `quantity` | `INT` | `NOT NULL` | Remaining batch units |
| `unit_price` | `DECIMAL(10,2)`| `NOT NULL` | Unit cost |
| `manufacturing_date`| `DATE`| `NOT NULL` | Mfg date (<= Today) |
| `expiry_date` | `DATE` | `NOT NULL` | Expiry date (> Mfg Date) |
| `status` | `VARCHAR(20)` | `NOT NULL` | `AVAILABLE`, `LOW_STOCK`, `EXPIRED`, `DISCARDED` |
| `created_at` | `DATETIME` | `NOT NULL` | Received date |

---

## 3. REST API Endpoints

All endpoints require JWT Bearer Token in `Authorization` header. Roles permitted: `ADMIN`, `PHARMACIST`, `STORE_MANAGER`.

### 3.1 Drug Categories (`/api/categories`)
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category details
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### 3.2 Suppliers (`/api/suppliers`)
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/{id}` - Get supplier details
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### 3.3 Drug Master Catalog (`/api/drugs`)
- `GET /api/drugs` - List all drugs
- `GET /api/drugs/{id}` - Get drug by ID
- `GET /api/drugs/search?query={q}&categoryId={catId}` - Live search & filter
- `POST /api/drugs` - Add new drug
- `PUT /api/drugs/{id}` - Update drug details
- `DELETE /api/drugs/{id}` - Delete drug

### 3.4 Inventory Batches (`/api/inventory-batches`)
- `GET /api/inventory-batches` - List all inventory batches
- `GET /api/inventory-batches/drug/{drugId}` - Get batches for specific drug
- `GET /api/inventory-batches/drug/{drugId}/fefo` - **Get FEFO ordered batches (earliest expiry first)**
- `POST /api/inventory-batches` - Receive new batch (Validates Mfg & Expiry dates)
- `PUT /api/inventory-batches/{id}` - Update batch
- `PATCH /api/inventory-batches/{id}/discard` - Mark batch as DISCARDED
- `DELETE /api/inventory-batches/{id}` - Delete batch

### 3.5 Inventory Overview & Alerts (`/api/inventory`)
- `GET /api/inventory` - Get summary inventory list
- `GET /api/inventory/dashboard` - Get full Inventory Dashboard metrics
- `GET /api/inventory/alerts/low-stock` - Get drugs below reorder level
- `GET /api/inventory/alerts/expiry?days=60` - Get batches expiring within N days
- `GET /api/inventory/alerts/expired` - Get expired batches
- `POST /api/inventory/deduct-fefo` - Deduct stock based on strict FEFO algorithm

---

## 4. FEFO (First Expire, First Out) Business Logic
1. **Batch Sorting**: Active batches are queried using `expiryDate ASC` filter:
   `findByDrugIdAndQuantityGreaterThanAndExpiryDateAfterOrderByExpiryDateAsc(drugId, 0, LocalDate.now())`
2. **Dispense Priority Flag**: The system flags the earliest expiring batch as `⚡ FEFO DISPENSE FIRST`.
3. **Automated FEFO Stock Deduction**: When stock is requested/dispensed, the `deductStockFEFO()` service iteratively consumes stock from the earliest expiring available batches first.
4. **Validation Rules**:
   - `manufacturingDate` must be `<= LocalDate.now()`.
   - `expiryDate` must be `> LocalDate.now()`.
   - `expiryDate` must be `> manufacturingDate`.

---

## 5. Directory & File Structure

```
ADproject/
├── backend/
│   ├── src/main/java/com/examly/springapp/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── DrugCategoryController.java
│   │   │   ├── SupplierController.java
│   │   │   ├── DrugController.java
│   │   │   ├── InventoryBatchController.java
│   │   │   └── InventoryController.java
│   │   ├── dto/
│   │   │   ├── DrugCategoryDTO.java
│   │   │   ├── SupplierDTO.java
│   │   │   ├── DrugDTO.java
│   │   │   ├── InventoryDTO.java
│   │   │   ├── InventoryBatchDTO.java
│   │   │   ├── InventoryDashboardDTO.java
│   │   │   └── StockDeductionRequest.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── DuplicateResourceException.java
│   │   │   └── InvalidInventoryException.java
│   │   ├── model/
│   │   │   ├── BatchStatus.java
│   │   │   ├── DrugCategory.java
│   │   │   ├── Supplier.java
│   │   │   ├── Drug.java
│   │   │   ├── Inventory.java
│   │   │   └── InventoryBatch.java
│   │   ├── repository/
│   │   │   ├── DrugCategoryRepository.java
│   │   │   ├── SupplierRepository.java
│   │   │   ├── DrugRepository.java
│   │   │   ├── InventoryRepository.java
│   │   │   └── InventoryBatchRepository.java
│   │   └── service/
│   │       ├── DrugCategoryService.java
│   │       ├── SupplierService.java
│   │       ├── DrugService.java
│   │       ├── InventoryBatchService.java
│   │       └── InventoryService.java
│   └── src/test/java/com/examly/springapp/
│       ├── AuthServiceTest.java
│       ├── AuthControllerTest.java
│       ├── DrugCategoryServiceTest.java
│       ├── DrugServiceTest.java
│       ├── InventoryBatchServiceTest.java
│       └── InventoryServiceTest.java
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosConfig.js
    │   │   ├── categoryApi.js
    │   │   ├── supplierApi.js
    │   │   ├── drugApi.js
    │   │   ├── batchApi.js
    │   │   └── inventoryApi.js
    │   ├── pages/
    │   │   ├── InventoryDashboard.jsx
    │   │   ├── DrugMasterPage.jsx
    │   │   ├── CategoryManagementPage.jsx
    │   │   ├── BatchManagementPage.jsx
    │   │   ├── LowStockAlertsPage.jsx
    │   │   ├── ExpiryAlertsPage.jsx
    │   │   └── SupplierManagementPage.jsx
    │   ├── App.jsx
    │   └── index.css
```

---

## 6. Integration Points

1. **Authentication Interceptor**: All Phase 2 Axios API requests automatically attach `Authorization: Bearer <token>` via `src/api/axiosConfig.js`.
2. **Role Protection**: Frontend routes are wrapped in `ProtectedRoute` allowing access to roles `ADMIN`, `PHARMACIST`, and `STORE_MANAGER`.
3. **Phase 1 Continuity**: User registration, login, JWT token generation, security logging, and password reset functions remain intact and fully supported.
