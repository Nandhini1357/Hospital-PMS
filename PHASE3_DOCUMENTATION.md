# Phase 3: E-Prescription & Dispensing Management Documentation

## 1. Overview
Phase 3 extends the Hospital Pharmacy Management System with comprehensive Electronic Prescription Generation, Verification, FEFO-Allocated Medication Dispensing, Patient Profiles, and Medication History tracking.

---

## 2. Database Schema (MySQL / JPA Entities)

### Patients Table (`patients`)
| Column Name | Type | Key / Constraints | Description |
|-------------|------|-------------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Patient Unique Primary ID |
| `patient_number` | VARCHAR(50) | UNIQUE, NOT NULL | Unique Patient Identifier (e.g. `PAT-00001`) |
| `full_name` | VARCHAR(100) | NOT NULL | Patient Full Name |
| `age` | INT | | Patient Age |
| `gender` | VARCHAR(20) | | Patient Gender (`MALE`, `FEMALE`, `OTHER`) |
| `contact_number` | VARCHAR(30) | | Phone Number |
| `address` | TEXT | | Home Address |
| `allergies` | TEXT | | Documented Drug Allergies |
| `medical_history` | TEXT | | Medical Conditions History |
| `created_at` | DATETIME | NOT NULL | Record Creation Timestamp |
| `updated_at` | DATETIME | | Record Update Timestamp |

### Prescriptions Table (`prescriptions`)
| Column Name | Type | Key / Constraints | Description |
|-------------|------|-------------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Prescription Unique Primary ID |
| `prescription_number` | VARCHAR(50) | UNIQUE, NOT NULL | Prescription Code (e.g. `RX-2026-0001`) |
| `patient_id` | BIGINT | FOREIGN KEY -> `patients(id)` | Associated Patient ID |
| `doctor_id` | BIGINT | FOREIGN KEY -> `users(id)` | Prescribing Doctor ID |
| `status` | VARCHAR(30) | NOT NULL | Enum: `PENDING`, `VERIFIED`, `DISPENSED`, `CANCELLED` |
| `notes` | TEXT | | Diagnosis & Prescription Notes |
| `created_at` | DATETIME | NOT NULL | Creation Timestamp |
| `updated_at` | DATETIME | | Last Modified Timestamp |

### Prescription Items Table (`prescription_items`)
| Column Name | Type | Key / Constraints | Description |
|-------------|------|-------------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Item Primary ID |
| `prescription_id` | BIGINT | FOREIGN KEY -> `prescriptions(id)` | Parent Prescription FK |
| `drug_id` | BIGINT | FOREIGN KEY -> `drugs(id)` | Target Drug FK |
| `dosage` | VARCHAR(100) | NOT NULL | Dosage Strength (e.g. `500mg`) |
| `frequency` | VARCHAR(100) | NOT NULL | Intake Frequency (e.g. `1-0-1`, `Twice Daily`) |
| `duration` | VARCHAR(100) | NOT NULL | Duration (e.g. `5 days`) |
| `quantity` | INT | NOT NULL | Total Units to Dispense |
| `instructions` | TEXT | | Special Patient Instructions |

### Dispensing Records Table (`dispensing_records`)
| Column Name | Type | Key / Constraints | Description |
|-------------|------|-------------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Record Primary ID |
| `dispensing_number` | VARCHAR(50) | UNIQUE, NOT NULL | Dispensing Code (e.g. `DSP-00001`) |
| `prescription_id` | BIGINT | FOREIGN KEY -> `prescriptions(id)` | Target Prescription FK |
| `pharmacist_id` | BIGINT | FOREIGN KEY -> `users(id)` | Dispensing Pharmacist FK |
| `dispensed_at` | DATETIME | NOT NULL | Dispensing Execution Timestamp |
| `notes` | TEXT | | Pharmacist Dispensing Notes |

### Medication History Table (`medication_history`)
| Column Name | Type | Key / Constraints | Description |
|-------------|------|-------------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | History Primary ID |
| `patient_id` | BIGINT | FOREIGN KEY -> `patients(id)` | Patient FK |
| `prescription_id` | BIGINT | FOREIGN KEY -> `prescriptions(id)` | Associated Prescription FK |
| `drug_id` | BIGINT | FOREIGN KEY -> `drugs(id)` | Dispensed Drug FK |
| `dosage` | VARCHAR(100) | NOT NULL | Dosage |
| `frequency` | VARCHAR(100) | NOT NULL | Frequency |
| `quantity_dispensed` | INT | NOT NULL | Dispensed Units |
| `dispensed_date` | DATETIME | NOT NULL | Date Dispensed |
| `pharmacist_name` | VARCHAR(100) | | Pharmacist Name |
| `notes` | TEXT | | Notes |

---

## 3. Role-Based Access Control Matrix

| Endpoint / Feature | Doctor | Pharmacist | Admin |
|--------------------|--------|------------|-------|
| Register / Edit Patient | Yes | Yes | Yes |
| Delete Patient | No | No | Yes |
| Create E-Prescription (`POST /api/prescriptions`) | Yes | No | No |
| Edit Pending Prescription (`PUT /api/prescriptions/{id}`) | Yes | No | No |
| Verify Prescription (`PUT /api/prescriptions/{id}/verify`) | No | Yes | No |
| Dispense Medication (`POST /api/dispensing`) | No | Yes | No |
| View Prescriptions & Stock Checks | Yes | Yes | Yes |
| View Dispensing Activity & Audit Logs | No | Yes | Yes |

---

## 4. FEFO Stock Validation & Deduction Workflow

1. **Pre-Dispensing Stock Check (`GET /api/prescriptions/{id}/stock-check`)**:
   - Queries available unexpired batch inventory for all drugs in the prescription (`expiry_date > today` and `quantity > 0` and `status != DISCARDED`).
   - Flags whether full prescription quantity is available across unexpired batches.

2. **Dispensing Execution (`POST /api/dispensing`)**:
   - Re-validates unexpired batch stock. Throws `InvalidInventoryException` if stock is expired or insufficient.
   - Invokes FEFO stock deduction (`InventoryService.deductStockFEFO(...)`), which orders batches by `expiryDate ASC` and deducts units.
   - Synchronizes total inventory stock and triggers low stock alerts if remaining inventory falls below reorder level.
   - Updates Prescription status to `DISPENSED`.
   - Generates a `DispensingRecord` and populates `MedicationHistory` entries for the patient.
   - Records audit event in `SecurityAuditLog`.
