import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceApi from '../api/invoiceApi';
import patientApi from '../api/patientApi';
import prescriptionApi from '../api/prescriptionApi';
import {
  FileText,
  Plus,
  ArrowLeft,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Search,
  DollarSign,
  ShieldCheck,
  Building,
  Receipt,
  X
} from 'lucide-react';

const FinanceGstInvoicePage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Invoice Form State
  const [newPatientId, setNewPatientId] = useState('');
  const [newPrescriptionId, setNewPrescriptionId] = useState('');
  const [subtotalInput, setSubtotalInput] = useState('500');
  const [insuranceInput, setInsuranceInput] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      const [invRes, patRes, rxRes] = await Promise.all([
        invoiceApi.getMyInvoices(),
        patientApi.getAll().catch(() => ({ data: [] })),
        prescriptionApi.getAll().catch(() => ({ data: [] }))
      ]);

      setInvoices(invRes.data || []);
      setPatients(patRes.data || []);
      setPrescriptions(rxRes.data || []);
    } catch (err) {
      console.error('Failed to load finance GST invoices data:', err);
      setError('Failed to load pharmacy GST invoice ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setError('');

    try {
      const sub = parseFloat(subtotalInput) || 0;
      const ins = parseFloat(insuranceInput) || 0;
      const gst = Math.round(sub * 0.18 * 100) / 100;
      const net = Math.max(0, sub + gst - ins);

      const payload = {
        patientId: newPatientId ? parseInt(newPatientId) : null,
        prescriptionId: newPrescriptionId ? parseInt(newPrescriptionId) : null,
        subtotal: sub,
        gstAmount: gst,
        insuranceCoverage: ins,
        netAmount: net,
        paymentStatus: 'UNPAID'
      };

      await invoiceApi.create(payload);
      setSuccessMsg('GST Tax Invoice generated successfully!');
      setShowGenerateModal(false);
      await fetchInitialData();
    } catch (err) {
      console.error('Failed to generate GST invoice:', err);
      setError('Failed to create GST invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.patientName && inv.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.prescriptionNumber && inv.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalGstCollected = invoices.reduce((acc, inv) => acc + (inv.gstAmount || 0), 0);
  const totalGrossBilling = invoices.reduce((acc, inv) => acc + (inv.netAmount || 0), 0);

  return (
    <div className="main-content">
      {/* Navigation & Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Hospital Pharmacy Finance & Tax Portal
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Receipt size={28} color="var(--primary-accent)" />
            Generate GST Invoices & Tax Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create official tax invoices with CGST (9%) and SGST (9%) breakdowns for patient prescriptions and pharmacy sales.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowGenerateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontWeight: 600 }}
        >
          <Plus size={18} />
          Generate New GST Invoice
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Tax Invoices</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {invoices.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered in pharmacy billing database</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>GST Tax Ledger Total (18%)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
            ₹{totalGstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CGST 9% + SGST 9% statutory breakdown</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Gross Billing Volume</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)', marginTop: '0.2rem' }}>
            ₹{totalGrossBilling.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inclusive of GST & TPA insurance coverage</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search GST invoices by invoice #, patient name, or RX number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>
      </div>

      {/* Invoices List Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading pharmacy GST tax invoices...
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No GST Invoices Found</h3>
          <p>No GST tax invoices match your search filter.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Invoice Number</th>
                <th style={{ padding: '0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.75rem' }}>Prescription</th>
                <th style={{ padding: '0.75rem' }}>Subtotal</th>
                <th style={{ padding: '0.75rem' }}>CGST (9%)</th>
                <th style={{ padding: '0.75rem' }}>SGST (9%)</th>
                <th style={{ padding: '0.75rem' }}>Net Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const cgst = Math.round((inv.gstAmount || 0) / 2 * 100) / 100;
                const sgst = cgst;

                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>{inv.patientName || 'Walk-in Patient'}</strong>
                      {inv.patientNumber && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.patientNumber}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{inv.prescriptionNumber || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>₹{(inv.subtotal || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', color: '#34d399' }}>₹{cgst.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', color: '#34d399' }}>₹{sgst.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{(inv.netAmount || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: inv.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: inv.paymentStatus === 'PAID' ? '#10b981' : '#ef4444'
                        }}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedInvoice(inv)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Printer size={14} />
                        GST Tax Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate New GST Invoice Modal */}
      {showGenerateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={20} color="var(--primary-accent)" />
                Generate New GST Tax Invoice
              </h3>
              <button className="btn btn-secondary" onClick={() => setShowGenerateModal(false)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Select Patient:
                </label>
                <select
                  className="form-control"
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">-- Walk-in / General Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.patientNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Select Prescription (Optional):
                </label>
                <select
                  className="form-control"
                  value={newPrescriptionId}
                  onChange={(e) => setNewPrescriptionId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">-- No Linked Prescription --</option>
                  {prescriptions.map((rx) => (
                    <option key={rx.id} value={rx.id}>
                      {rx.prescriptionNumber} - Patient: {rx.patientName || 'N/A'} ({rx.status})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Medicines Subtotal Amount (₹):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={subtotalInput}
                  onChange={(e) => setSubtotalInput(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  TPA Insurance Deduction (₹):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={insuranceInput}
                  onChange={(e) => setInsuranceInput(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Tax Calculation Preview */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span>Subtotal:</span>
                  <strong>₹{parseFloat(subtotalInput || 0).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#34d399' }}>
                  <span>CGST (9%):</span>
                  <span>+ ₹{(Math.round((parseFloat(subtotalInput || 0) * 0.09) * 100) / 100).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#34d399' }}>
                  <span>SGST (9%):</span>
                  <span>+ ₹{(Math.round((parseFloat(subtotalInput || 0) * 0.09) * 100) / 100).toFixed(2)}</span>
                </div>
                {parseFloat(insuranceInput) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#60a5fa' }}>
                    <span>TPA Cashless Coverage:</span>
                    <span>- ₹{parseFloat(insuranceInput).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
                  <span>Net Payable Amount:</span>
                  <span style={{ color: 'var(--primary-accent)' }}>
                    ₹{Math.max(0, parseFloat(subtotalInput || 0) * 1.18 - parseFloat(insuranceInput || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1, fontWeight: 700 }}>
                  {submitting ? 'Generating...' : 'Issue GST Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable GST Tax Invoice Modal */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px', background: 'var(--bg-primary)', border: '1px solid var(--primary-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  OFFICIAL TAX INVOICE
                </span>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0.1rem 0' }}>
                  Invoice #{selectedInvoice.invoiceNumber}
                </h2>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            {/* GST Invoice Printable Template */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '1.5rem', fontSize: '0.85rem', border: '1px dashed var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-accent)', fontWeight: 700 }}>HOSPITAL PHARMACY SERVICES</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    GSTIN: <strong>33AAAAA0000A1Z5</strong> | HSN Code: <strong>3004</strong><br />
                    100 Healthcare Complex, Medical Center City
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Date of Issue:</span>
                  <div style={{ fontWeight: 600 }}>{selectedInvoice.invoiceDate ? new Date(selectedInvoice.invoiceDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Billed To Patient:</span>
                  <strong>{selectedInvoice.patientName || 'Walk-in Patient'}</strong> ({selectedInvoice.patientNumber || 'PAT-DEMO'})
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Prescription Ref:</span>
                  <strong>{selectedInvoice.prescriptionNumber || 'N/A'}</strong>
                </div>
              </div>

              {/* Tax Breakdowns */}
              <table style={{ width: '100%', marginBottom: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.5rem' }}>Description</th>
                    <th style={{ padding: '0.5rem' }}>HSN</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Pharmaceutical Prescription Dispensing</td>
                    <td style={{ padding: '0.5rem' }}>3004</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{(selectedInvoice.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', color: '#34d399' }}>Central GST (CGST @ 9%)</td>
                    <td style={{ padding: '0.5rem', color: '#34d399' }}>Tax</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', color: '#34d399' }}>+ ₹{((selectedInvoice.gstAmount || 0) / 2).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', color: '#34d399' }}>State GST (SGST @ 9%)</td>
                    <td style={{ padding: '0.5rem', color: '#34d399' }}>Tax</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', color: '#34d399' }}>+ ₹{((selectedInvoice.gstAmount || 0) / 2).toFixed(2)}</td>
                  </tr>
                  {selectedInvoice.insuranceCoverage > 0 && (
                    <tr>
                      <td style={{ padding: '0.5rem', color: '#60a5fa' }}>TPA Cashless Pre-Auth Coverage</td>
                      <td style={{ padding: '0.5rem', color: '#60a5fa' }}>TPA</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', color: '#60a5fa' }}>- ₹{(selectedInvoice.insuranceCoverage || 0).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontWeight: 700, fontSize: '1rem' }}>
                <span>Net Total Payable:</span>
                <span style={{ color: '#34d399' }}>₹{(selectedInvoice.netAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Authorized by Hospital Finance Department
              </span>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={16} />
                Print Tax Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceGstInvoicePage;
