package com.examly.springapp.repository;

import com.examly.springapp.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByPatientId(Long patientId);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByPrescriptionId(Long prescriptionId);
}
