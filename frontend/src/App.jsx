import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

// Phase 2 Inventory Pages
import InventoryDashboard from './pages/InventoryDashboard';
import DrugMasterPage from './pages/DrugMasterPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import BatchManagementPage from './pages/BatchManagementPage';
import LowStockAlertsPage from './pages/LowStockAlertsPage';
import ExpiryAlertsPage from './pages/ExpiryAlertsPage';
import SupplierManagementPage from './pages/SupplierManagementPage';
import BarcodeScannerPage from './pages/BarcodeScannerPage';
import DrugInteractionPage from './pages/DrugInteractionPage';

// Phase 3 E-Prescription & Dispensing Management Pages
import PatientManagementPage from './pages/PatientManagementPage';
import CreatePrescriptionPage from './pages/CreatePrescriptionPage';
import PrescriptionListPage from './pages/PrescriptionListPage';
import PrescriptionDetailsPage from './pages/PrescriptionDetailsPage';
import PendingPrescriptionsPage from './pages/PendingPrescriptionsPage';
import DispensingPage from './pages/DispensingPage';
import MedicationHistoryPage from './pages/MedicationHistoryPage';

// Phase 4 Narcotics & Controlled Substance Management Register
import NarcoticsManagementPage from './pages/NarcoticsManagementPage';

// Phase 5 Procurement & Supplier Management
import ProcurementPage from './pages/ProcurementPage';

import UserManagementPage from './pages/UserManagementPage';
import PatientInvoicesPage from './pages/PatientInvoicesPage';
import CounterCollectionPage from './pages/CounterCollectionPage';
import FinanceGstInvoicePage from './pages/FinanceGstInvoicePage';
import FinanceInsurancePreAuthPage from './pages/FinanceInsurancePreAuthPage';
import FinanceDuesAgeingPage from './pages/FinanceDuesAgeingPage';

function App() {
  const allowedInventoryRoles = ['PHARMACIST', 'STORE_MANAGER', 'ADMIN'];
  const allowedPrescriptionRoles = ['PATIENT', 'PHARMACIST', 'DOCTOR', 'ADMIN'];

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin User Management Route */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 5: Procurement & Supplier Management Route */}
              <Route
                path="/procurement"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <ProcurementPage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 2: Drug Master Catalog & FEFO Inventory Routes */}
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <InventoryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/drugs"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <DrugMasterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/categories"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/batches"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <BatchManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/low-stock"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <LowStockAlertsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/expiry-alerts"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <ExpiryAlertsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/suppliers"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <SupplierManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/barcode-scanner"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <BarcodeScannerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/drug-interactions"
                element={
                  <ProtectedRoute allowedRoles={allowedInventoryRoles}>
                    <DrugInteractionPage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 3: E-Prescription & Dispensing Management Routes */}
              <Route
                path="/patients"
                element={
                  <ProtectedRoute allowedRoles={allowedPrescriptionRoles}>
                    <PatientManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <ProtectedRoute allowedRoles={allowedPrescriptionRoles}>
                    <PrescriptionListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions/new"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <CreatePrescriptionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions/pending"
                element={
                  <ProtectedRoute allowedRoles={['PHARMACIST', 'ADMIN']}>
                    <PendingPrescriptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions/:id"
                element={
                  <ProtectedRoute allowedRoles={allowedPrescriptionRoles}>
                    <PrescriptionDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dispensing/:prescriptionId"
                element={
                  <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <DispensingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medication-history"
                element={
                  <ProtectedRoute allowedRoles={allowedPrescriptionRoles}>
                    <MedicationHistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Patient Billing & Online Invoices */}
              <Route
                path="/patient/invoices"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'FINANCE', 'ADMIN']}>
                    <PatientInvoicesPage />
                  </ProtectedRoute>
                }
              />

              {/* Finance Management Routes */}
              <Route
                path="/finance/gst-invoice"
                element={
                  <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                    <FinanceGstInvoicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/insurance-preauth"
                element={
                  <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                    <FinanceInsurancePreAuthPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/dues-ageing"
                element={
                  <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                    <FinanceDuesAgeingPage />
                  </ProtectedRoute>
                }
              />

              {/* Patient Pharmacy Counter Collection Schedule */}
              <Route
                path="/patient/counter-collection"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}>
                    <CounterCollectionPage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 4: Narcotics & Controlled Substance Management Register */}
              <Route
                path="/narcotics"
                element={
                  <ProtectedRoute allowedRoles={['PHARMACIST', 'STORE_MANAGER', 'ADMIN']}>
                    <NarcoticsManagementPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
