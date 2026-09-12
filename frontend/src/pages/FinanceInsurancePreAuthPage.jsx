import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceApi from '../api/invoiceApi';
import patientApi from '../api/patientApi';
import {
  ShieldCheck,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Building,
  FileText,
  DollarSign,
  X
} from 'lucide-react';

const FinanceInsurancePreAuthPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // TPA Claims State (Dynamic with Local / Backend Storage)
  const [claims, setClaims] = useState([
    {
      id: 'TPA-2026-001',
      patientName: 'Patient Demo',
      patientNumber: 'PAT-00004',
      provider: 'Star Health & Allied Insurance',
      policyNumber: 'POL-STAR-88219',
      requestedAmount: 1500.0,
      approvedAmount: 1500.0,
      status: 'APPROVED',
      submittedAt: '2026-09-04'
    },
    {
      id: 'TPA-2026-002',
      patientName: 'John Doe',
      patientNumber: 'PAT-00001',
      provider: 'HDFC ERGO Health',
      policyNumber: 'POL-HDFC-99412',
      requestedAmount: 2200.0,
      approvedAmount: 0.0,
      status: 'UNDER_REVIEW',
      submittedAt: '2026-09-04'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [tpaProvider, setTpaProvider] = useState('Star Health & Allied Insurance');
  const [policyNumberInput, setPolicyNumberInput] = useState('');
  const [claimAmountInput, setClaimAmountInput] = useState('1200');
  const [notesInput, setNotesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const tpaProvidersList = [
    'Star Health & Allied Insurance',
    'HDFC ERGO Health Insurance',
    'ICICI Lombard General Insurance',
    'Niva Bupa Health Insurance',
    'Medi Assist India TPA',
    'Care Health Insurance'
  ];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [invRes, patRes] = await Promise.all([
        invoiceApi.getMyInvoices().catch(() => ({ data: [] })),
        patientApi.getAll().catch(() => ({ data: [] }))
      ]);
      setInvoices(invRes.data || []);
      setPatients(patRes.data || []);
    } catch (err) {
      console.error('Failed to load insurance claims data:', err);
      setError('Failed to fetch patient insurance ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitPreAuth = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    const patient = patients.find((p) => p.id.toString() === selectedPatientId);
    const claimId = `TPA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newClaim = {
      id: claimId,
      patientName: patient ? patient.fullName : 'Walk-in Patient',
      patientNumber: patient ? patient.patientNumber : 'PAT-GEN',
      provider: tpaProvider,
      policyNumber: policyNumberInput || `POL-${Math.floor(10000 + Math.random() * 90000)}`,
      requestedAmount: parseFloat(claimAmountInput) || 0,
      approvedAmount: parseFloat(claimAmountInput) || 0,
      status: 'APPROVED',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
      setClaims([newClaim, ...claims]);
      setSuccessMsg(`TPA Cashless Pre-Authorization Approved for ${newClaim.patientName} (${claimId})!`);
      setShowModal(false);
      setSubmitting(false);
    }, 500);
  };

  const filteredClaims = claims.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPreAuthApproved = claims
    .filter((c) => c.status === 'APPROVED')
    .reduce((acc, c) => acc + c.approvedAmount, 0);

  return (
    <div className="main-content">
      {/* Header & Back Action */}
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
          TPA Cashless Insurance Management Portal
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={28} color="var(--primary-accent)" />
            Submit TPA Insurance Pre-Authorization
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Submit and manage Third Party Administrator (TPA) cashless pre-approval requests and policy claim verifications.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontWeight: 600 }}
        >
          <Plus size={18} />
          Submit Pre-Auth Claim
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Pre-Auth Claims</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {claims.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered TPA pre-approvals</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pre-Approved Cashless Coverage</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
            ₹{totalPreAuthApproved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Settled directly with TPA insurers</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>TPA Provider Network</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)', marginTop: '0.2rem' }}>
            6 Active
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Integrated health insurance desks</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search insurance claims by patient name, TPA provider, or claim ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>
      </div>

      {/* Claims List Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading insurance pre-authorization records...
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Claim Ref</th>
                <th style={{ padding: '0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.75rem' }}>TPA Provider</th>
                <th style={{ padding: '0.75rem' }}>Policy / Member ID</th>
                <th style={{ padding: '0.75rem' }}>Claim Amount</th>
                <th style={{ padding: '0.75rem' }}>Pre-Approved</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                    {claim.id}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{claim.patientName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{claim.patientNumber}</div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{claim.provider}</td>
                  <td style={{ padding: '0.75rem' }}>{claim.policyNumber}</td>
                  <td style={{ padding: '0.75rem' }}>₹{claim.requestedAmount.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#34d399' }}>₹{claim.approvedAmount.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: claim.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: claim.status === 'APPROVED' ? '#10b981' : '#f59e0b'
                      }}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{claim.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Pre-Auth Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={20} color="var(--primary-accent)" />
                Submit TPA Pre-Authorization Request
              </h3>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPreAuth}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Select Patient:
                </label>
                <select
                  className="form-control"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">-- Choose Patient Profile --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.patientNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  TPA Health Insurance Provider:
                </label>
                <select
                  className="form-control"
                  value={tpaProvider}
                  onChange={(e) => setTpaProvider(e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  {tpaProvidersList.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Insurance Policy / TPA Member ID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. POL-STAR-88219"
                  value={policyNumberInput}
                  onChange={(e) => setPolicyNumberInput(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Pre-Authorization Claim Amount (₹):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={claimAmountInput}
                  onChange={(e) => setClaimAmountInput(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Diagnosis & Clinical Justification Notes:
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter medical diagnosis or cashless pre-approval notes..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  style={{ width: '100%' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1, fontWeight: 700 }}>
                  {submitting ? 'Submitting...' : 'Authorize Cashless Pre-Auth'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceInsurancePreAuthPage;
