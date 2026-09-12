-- ====================================================================
-- Hospital Pharmacy Management System (HPMS) - Database Schema Phase 1
-- Database: MySQL 8.0+ / JPA Compatible Relational Schema
-- ====================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    licence_number VARCHAR(50),
    employee_id VARCHAR(50),
    mobile VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    lockout_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_identity VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expiry_time DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Phase 5: Procurement & Supplier Management Tables
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    gstin VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    notes VARCHAR(500),
    created_by_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL,
    drug_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (drug_id) REFERENCES drugs(id)
);

CREATE TABLE IF NOT EXISTS goods_receipt_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grn_number VARCHAR(50) NOT NULL UNIQUE,
    purchase_order_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,
    invoice_number VARCHAR(100),
    received_date DATE NOT NULL,
    received_by_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_INSPECTION',
    notes VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (received_by_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS grn_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grn_id BIGINT NOT NULL,
    po_item_id BIGINT,
    drug_id BIGINT NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE,
    received_quantity INT NOT NULL,
    accepted_quantity INT DEFAULT 0,
    rejected_quantity INT DEFAULT 0,
    unit_price DECIMAL(10,2),
    inspection_status VARCHAR(20),
    rejection_reason VARCHAR(500),
    FOREIGN KEY (grn_id) REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
    FOREIGN KEY (po_item_id) REFERENCES purchase_order_items(id) ON DELETE SET NULL,
    FOREIGN KEY (drug_id) REFERENCES drugs(id)
);

CREATE TABLE IF NOT EXISTS quality_inspections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grn_id BIGINT NOT NULL UNIQUE,
    inspected_by_id BIGINT,
    inspection_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grn_id) REFERENCES goods_receipt_notes(id),
    FOREIGN KEY (inspected_by_id) REFERENCES users(id) ON DELETE SET NULL
);

