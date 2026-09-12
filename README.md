# Hospital Pharmacy Management System (HPMS)

## Overview
Full-stack **Hospital Pharmacy Management System (HPMS)** built with Spring Boot 3.x backend, React frontend, JWT Security & Role-Based Access Control, FEFO Inventory Management, and E-Prescription & Dispensing Workflows.

---

## Completed Phases

### Phase 1: Authentication & Role-Based Access Control (RBAC)
- **Spring Boot Backend** running on port `8080` with Java 17+.
- **React Frontend** running on port `8081` with React Router DOM v6.
- **JWT Security & RBAC**: Configured token lifetimes per role (8h Pharmacist, 12h Manager, 24h Admin).
- **User Roles**: `ADMIN`, `DOCTOR`, `PHARMACIST`, `STORE_MANAGER`, `FINANCE`, `PATIENT`.
- **Account Security**: Progressive lockout, inactivity logout, password reset via OTP, security event audit logging in `security_audit_logs`.

### Phase 2: Drug Master Catalog & FEFO Inventory Management
- **Drug Master Catalog**: Full CRUD for drugs and categories with code/name uniqueness.
- **Supplier Directory**: Supplier contact and location management.
- **FEFO Inventory Control**: First-Expire, First-Out batch allocation, expiry tracking, discarded status tracking.
- **Low Stock & Expiry Alerts**: Automated reorder level warnings and 60-day expiry notifications.

### Phase 3: E-Prescription & Dispensing Management
- **Patient Management**: Patient registration (`PAT-XXXXX`), demographic profiles, medical history & allergy tracking.
- **Electronic Prescriptions**: Doctors create multi-medicine e-prescriptions (`RX-YYYY-XXXX`) with dosage, frequency, duration, quantity, and instructions.
- **Pharmacist Dispensing**: Verification and single-click dispensing queue (`DSP-XXXXX`).
- **FEFO Batch Allocation & Inventory Stock Deduction**: Dispensing automatically checks unexpired batch availability, deducts inventory stock in FEFO order, and prevents dispensing of expired drugs.
- **Patient Medication History**: Comprehensive audit history of all dispensed medications per patient.
- **Role Restrictions**: Only Doctors can create prescriptions; only Pharmacists can dispense; Administrators monitor audit logs and dispensing activities.

### Phase 4: Narcotics & Controlled Substance Management Register
- **Statutory Narcotics Register**: Tamper-evident ledger with SHA-256 digital signature verification hashing.
- **Dual-Pharmacist Authorization**: Enforces authentication & digital signatures of two distinct active pharmacists for controlled substance dispensing (`primary_pharmacist` != `secondary_pharmacist`).
- **Emergency Override Workflow**: Single-pharmacist emergency dispensing with mandatory justification reason and retrospective senior-pharmacist approval.
- **Lot-Level Traceability**: Links every transaction to original drug batch, manufacturer, supplier invoice, prescription, doctor, and patient.
- **Shift-End Stock Reconciliation**: Calculates expected closing stock (`opening_stock - dispensed + received`), flags discrepancies > 2% for mandatory explanation & supervisor audit escalation.
- **CDSCO Compliance Reporting**: Automated monthly CDSCO statutory report generation with PDF/print and Excel/CSV exports.

---

## Key REST APIs

| Category | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| **Patients** | `GET` | `/api/patients` | Doctor, Pharmacist, Admin | Search/List patients |
| **Patients** | `POST` | `/api/patients` | Doctor, Pharmacist, Admin | Register new patient profile |
| **Patients** | `GET` | `/api/patients/{id}/history` | Doctor, Pharmacist, Admin | Get patient medication history |
| **Prescriptions** | `GET` | `/api/prescriptions` | Doctor, Pharmacist, Admin | View all prescriptions |
| **Prescriptions** | `GET` | `/api/prescriptions/pending` | Doctor, Pharmacist, Admin | View pending/verified prescription queue |
| **Prescriptions** | `POST` | `/api/prescriptions` | Doctor | Create electronic prescription |
| **Prescriptions** | `PUT` | `/api/prescriptions/{id}` | Doctor | Edit prescription before dispensing |
| **Prescriptions** | `PUT` | `/api/prescriptions/{id}/verify` | Pharmacist | Verify prescription |
| **Prescriptions** | `GET` | `/api/prescriptions/{id}/stock-check` | Doctor, Pharmacist, Admin | FEFO stock availability check |
| **Dispensing** | `POST` | `/api/dispensing` | Pharmacist | Execute FEFO stock deduction & dispense |
| **Dispensing** | `GET` | `/api/dispensing` | Pharmacist, Admin | View dispensing audit records |
| **History** | `GET` | `/api/medication-history` | Doctor, Pharmacist, Admin | View medication history timeline |
| **Narcotics** | `GET` | `/api/narcotics/register` | Pharmacist, Manager, Admin | Query tamper-evident narcotics ledger |
| **Narcotics** | `POST` | `/api/narcotics/dispense` | Pharmacist, Admin | Dual-pharmacist or emergency dispense |
| **Narcotics** | `GET` | `/api/narcotics/balance` | Pharmacist, Manager, Admin | Get narcotics stock balance math |
| **Narcotics** | `POST` | `/api/narcotics/reconcile` | Pharmacist, Manager, Admin | Stock reconciliation & >2% variance alert |
| **Narcotics** | `GET` | `/api/narcotics/report` | Pharmacist, Manager, Admin | Monthly CDSCO compliance report data |
| **Narcotics** | `POST` | `/api/narcotics/receipt` | Pharmacist, Manager, Admin | Log controlled substance stock receipt |
| **Narcotics** | `POST` | `/api/narcotics/destruction` | Pharmacist, Manager, Admin | Log narcotics destruction with witness |
| **Narcotics** | `POST` | `/api/narcotics/{id}/approve-override` | Pharmacist, Manager, Admin | Senior pharmacist retrospective approval |

---

## How to Run

### Backend (Spring Boot - Port 8080)
```bash
cd backend
mvn spring-boot:run
```

### Backend Unit & Integration Tests
```bash
cd backend
mvn test
```

### Frontend (React - Port 8081)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:8081` in your browser.
