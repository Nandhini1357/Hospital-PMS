package com.examly.springapp;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DrugCategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryBatchRepository batchRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed default users idempotently (check email existence per user)
        String encodedPass = passwordEncoder.encode("Password123!");
        List<User> seedUsers = Arrays.asList(
                new User(null, "System Administrator", "admin@hospital.com", encodedPass, Role.ADMIN, "LIC-ADM01", "EMP-ADM01", "9876543210", true),
                new User(null, "Primary Pharmacist", "pharmacist@hospital.com", encodedPass, Role.PHARMACIST, "LIC-PHARM01", "EMP-PH01", "9876543211", true),
                new User(null, "Secondary Pharmacist", "pharmacist2@hospital.com", encodedPass, Role.PHARMACIST, "LIC-PHARM02", "EMP-PH02", "9876543212", true),
                new User(null, "Dr. Sarah Jenkins", "doctor@hospital.com", encodedPass, Role.DOCTOR, "LIC-DOC01", "EMP-DOC01", "9876543213", true),
                new User(null, "Store Manager", "manager@hospital.com", encodedPass, Role.STORE_MANAGER, "LIC-MGR01", "EMP-MGR01", "9876543214", true),
                new User(null, "Finance Officer", "finance@hospital.com", encodedPass, Role.FINANCE, "LIC-FIN01", "EMP-FIN01", "9876543215", true),
                new User(null, "Patient User", "patient@hospital.com", encodedPass, Role.PATIENT, null, null, "9876543216", true)
        );
        for (User u : seedUsers) {
            if (userRepository.findByEmail(u.getEmail()).isEmpty()) {
                userRepository.save(u);
            }
        }

        // 2. Seed default drug categories idempotently
        List<DrugCategory> seedCategories = Arrays.asList(
                new DrugCategory("Analgesics & Antipyretics", "Pain relief and fever reducing medications"),
                new DrugCategory("Antibiotics & Antimicrobials", "Antibacterial and anti-infective formulations"),
                new DrugCategory("Cardiovascular", "Heart and blood pressure management drugs"),
                new DrugCategory("Gastrointestinal", "Digestive system and antacid medications"),
                new DrugCategory("Vitamins & Supplements", "Nutritional and dietary supplements"),
                new DrugCategory("Dermatological", "Skin treatments, ointments, and topical creams"),
                new DrugCategory("Respiratory & Antihistamines", "Allergy, asthma, and cold remedies"),
                new DrugCategory("Narcotics & Controlled", "Schedule H1 and controlled narcotics")
        );
        for (DrugCategory cat : seedCategories) {
            if (categoryRepository.findByNameIgnoreCase(cat.getName()).isEmpty()) {
                categoryRepository.save(cat);
            }
        }

        // 3. Seed default suppliers idempotently
        List<Supplier> seedSuppliers = Arrays.asList(
                new Supplier("Pfizer Pharmaceuticals", "John Smith", "orders@pfizer.com", "9876543210", "New York, USA"),
                new Supplier("Sun Pharma Industries", "Rajesh Kumar", "supply@sunpharma.com", "9123456789", "Mumbai, India"),
                new Supplier("Novartis Healthcare", "Sarah Jenkins", "contact@novartis.com", "9988776655", "Basel, Switzerland")
        );
        for (Supplier sup : seedSuppliers) {
            if (!supplierRepository.existsByNameIgnoreCase(sup.getName())) {
                supplierRepository.save(sup);
            }
        }

        // 4. Seed default patients idempotently
        List<Patient> seedPatients = Arrays.asList(
                new Patient("PAT-10001", "Patient User", 35, "MALE", "9876543216", "123 Health Blvd, City", "Penicillin", "Hypertension"),
                new Patient("PAT-10002", "Jane Smith", 28, "FEMALE", "9876543299", "456 Oak Avenue, City", "None", "Asthma")
        );
        for (Patient p : seedPatients) {
            if (patientRepository.findByPatientNumber(p.getPatientNumber()).isEmpty()) {
                patientRepository.save(p);
            }
        }

        // 5. Seed default catalog drugs and batches idempotently
        DrugCategory analgesics = categoryRepository.findByNameIgnoreCase("Analgesics & Antipyretics").orElse(categoryRepository.findAll().get(0));
        DrugCategory antibiotics = categoryRepository.findByNameIgnoreCase("Antibiotics & Antimicrobials").orElse(categoryRepository.findAll().get(0));
        DrugCategory narcotics = categoryRepository.findByNameIgnoreCase("Narcotics & Controlled").orElse(categoryRepository.findAll().get(0));
        DrugCategory respiratory = categoryRepository.findByNameIgnoreCase("Respiratory & Antihistamines").orElse(categoryRepository.findAll().get(0));
        DrugCategory gastro = categoryRepository.findByNameIgnoreCase("Gastrointestinal").orElse(categoryRepository.findAll().get(0));

        List<Drug> seedDrugs = Arrays.asList(
                new Drug("Paracetamol 500mg", "Acetaminophen", "8901234567890", analgesics, "Tablet", 50, "Standard analgesic and antipyretic"),
                new Drug("Amoxicillin 500mg", "Amoxicillin Trihydrate", "8901234567891", antibiotics, "Capsule", 30, "Broad spectrum penicillin antibiotic"),
                new Drug("Morphine Sulfate 10mg", "Morphine", "8901234567892", narcotics, "Ampoule", 10, "Schedule H1 Opioid Narcotic Analgesic"),
                new Drug("Cetirizine 10mg", "Cetirizine Hydrochloride", "8901234567893", respiratory, "Tablet", 20, "Second-generation antihistamine"),
                new Drug("Omeprazole 20mg", "Omeprazole", "8901234567894", gastro, "Capsule", 25, "Proton pump inhibitor for GERD")
        );

        seedDrugs.get(2).setIsNarcotic(true);
        seedDrugs.get(2).setIsScheduleH1(true);

        Supplier defaultSupplier = supplierRepository.findAll().get(0);

        for (Drug seedDrug : seedDrugs) {
            Drug targetDrug;
            if (drugRepository.findByNameIgnoreCase(seedDrug.getName()).isPresent()) {
                targetDrug = drugRepository.findByNameIgnoreCase(seedDrug.getName()).get();
            } else if (drugRepository.findByCodeIgnoreCase(seedDrug.getCode()).isPresent()) {
                targetDrug = drugRepository.findByCodeIgnoreCase(seedDrug.getCode()).get();
            } else {
                targetDrug = drugRepository.save(seedDrug);
            }

            if (inventoryRepository.findByDrugId(targetDrug.getId()).isEmpty()) {
                Inventory inv = new Inventory(targetDrug, 150, targetDrug.getReorderLevel());
                inventoryRepository.save(inv);
            }

            String b1Num = "BATCH-" + targetDrug.getCode() + "-01";
            if (batchRepository.findByDrugIdAndBatchNumber(targetDrug.getId(), b1Num).isEmpty()) {
                InventoryBatch batch1 = new InventoryBatch(
                        targetDrug,
                        defaultSupplier,
                        b1Num,
                        100,
                        BigDecimal.valueOf(12.50),
                        LocalDate.now().minusDays(15),
                        LocalDate.now().plusMonths(12)
                );
                batch1.setManufacturer("Sun Pharma Industries");
                batch1.setSupplierInvoice("INV-SEED-01");
                batchRepository.save(batch1);
            }

            String b2Num = "BATCH-" + targetDrug.getCode() + "-02";
            if (batchRepository.findByDrugIdAndBatchNumber(targetDrug.getId(), b2Num).isEmpty()) {
                InventoryBatch batch2 = new InventoryBatch(
                        targetDrug,
                        defaultSupplier,
                        b2Num,
                        50,
                        BigDecimal.valueOf(12.50),
                        LocalDate.now().minusDays(30),
                        LocalDate.now().plusMonths(6)
                );
                batch2.setManufacturer("Pfizer Pharmaceuticals");
                batch2.setSupplierInvoice("INV-SEED-02");
                batchRepository.save(batch2);
            }
        }

        // 6. Seed sample e-prescription idempotently
        String sampleRxNumber = "RX-2026-0001";
        if (prescriptionRepository.findByPrescriptionNumber(sampleRxNumber).isEmpty() && patientRepository.count() > 0) {
            Patient patient = patientRepository.findByPatientNumber("PAT-10001").orElse(patientRepository.findAll().get(0));
            User doctor = userRepository.findByEmail("doctor@hospital.com").orElse(null);
            Drug pcm = drugRepository.findByNameIgnoreCase("Paracetamol 500mg").orElse(drugRepository.findAll().get(0));

            if (doctor != null) {
                Prescription rx = new Prescription(sampleRxNumber, patient, doctor, "Initial outpatient prescription for fever");
                rx.setStatus(PrescriptionStatus.PENDING);
                PrescriptionItem item = new PrescriptionItem(pcm, "500mg", "1-0-1", "5 days", 10, "Take after meals");
                rx.addItem(item);
                prescriptionRepository.save(rx);
            }
        }
    }
}
