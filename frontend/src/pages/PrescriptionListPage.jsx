import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import prescriptionApi from '../api/prescriptionApi';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Search, Eye, CheckSquare, PackageCheck, XCircle, Filter } from 'lucide-react';

const PrescriptionListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchPrescriptions = async (query = '', status = '') => {
    setLoading(true);
    try {
      const res = await prescriptionApi.getAll(query, status === 'ALL' ? '' : status);
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions(searchQuery, activeTab);
  }, [activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrescriptions(searchQuery, activeTab);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>PENDING</span>;
      case 'VERIFIED':
        return <span style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold' }}>VERIFIED</span>;
      case 'DISPENSED':
        return <span style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>DISPENSED</span>;
      case 'CANCELLED':
        return <span style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>CANCELLED</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (user?.role === 'PATIENT') {
    return (
      <div className="main-content">
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>My E-Prescriptions & Medications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View your personal e-prescriptions, dosage instructions, and pharmacy collection status.</p>
        </div>

        {/* Patient Search */}
        <form onSubmit={handleSearch} className="search-container" style={{ marginBottom: '1.5rem' }}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search by RX number or drug name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="search-icon" />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Prescriptions Found</h3>
            <p>You currently have no active or historical e-prescriptions linked to your profile.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
                      Prescription #{rx.prescriptionNumber}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Prescribed by {rx.doctorName || 'Dr. Medical Staff'} on {new Date(rx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(rx.status)}
                  </div>
                </div>

                {/* Prescribed Items Table */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>PRESCRIBED MEDICATIONS:</h4>
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table className="data-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Medication / Drug Name</th>
                        <th style={{ padding: '0.5rem' }}>Dosage</th>
                        <th style={{ padding: '0.5rem' }}>Frequency</th>
                        <th style={{ padding: '0.5rem' }}>Duration</th>
                        <th style={{ padding: '0.5rem' }}>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.items && rx.items.length > 0 ? (
                        rx.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{item.drugName} ({item.drugCode || 'DRUG'})</td>
                            <td style={{ padding: '0.5rem' }}>{item.dosage}</td>
                            <td style={{ padding: '0.5rem' }}>{item.frequency}</td>
                            <td style={{ padding: '0.5rem' }}>{item.duration}</td>
                            <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{item.instructions || 'Take as directed'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>Medication details attached to physical prescription file.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Collection / Dispensing Instructions Banner */}
                <div style={{ background: rx.status === 'DISPENSED' ? 'rgba(16, 185, 129, 0.1)' : rx.status === 'VERIFIED' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${rx.status === 'DISPENSED' ? '#10b981' : rx.status === 'VERIFIED' ? '#3b82f6' : '#f59e0b'}`, padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Collection & Dispensing Status: </strong>
                    {rx.status === 'DISPENSED' && <span>Dispensing Complete — Prescription fulfilled by hospital pharmacy.</span>}
                    {rx.status === 'VERIFIED' && <span>Verified & Ready — Please present your RX number at Hospital Pharmacy Counter #1 for collection.</span>}
                    {rx.status === 'PENDING' && <span>Processing — Received by hospital pharmacy; awaiting verification by pharmacist.</span>}
                    {rx.status === 'CANCELLED' && <span>Cancelled — Contact prescribing doctor for details.</span>}
                  </div>
                  <Link to={`/prescriptions/${rx.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>
                    View Full Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>E-Prescriptions Master Queue</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage electronic prescriptions, verification workflow, and dispensing queues.</p>
        </div>
        {user?.role === 'DOCTOR' && (
          <Link to="/prescriptions/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            <span>Create E-Prescription</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {['ALL', 'PENDING', 'VERIFIED', 'DISPENSED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search by RX number (RX-XXXX-XXXX) or Patient Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {/* Prescriptions Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No prescriptions found in this queue view.</div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Prescription #</th>
                <th style={{ padding: '0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.75rem' }}>Prescribing Doctor</th>
                <th style={{ padding: '0.75rem' }}>Medicines Count</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Created Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx) => (
                <tr key={rx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
                    <Link to={`/prescriptions/${rx.id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {rx.prescriptionNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{rx.patientName} ({rx.patientNumber})</td>
                  <td style={{ padding: '0.75rem' }}>{rx.doctorName || 'Dr. Medical Staff'}</td>
                  <td style={{ padding: '0.75rem' }}>{rx.items?.length || 0} item(s)</td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(rx.status)}</td>
                  <td style={{ padding: '0.75rem' }}>{new Date(rx.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <Link to={`/prescriptions/${rx.id}`} className="btn btn-secondary" title="View Prescription" style={{ padding: '0.35rem 0.6rem' }}>
                        <Eye size={15} />
                      </Link>

                      {user?.role === 'PHARMACIST' && (rx.status === 'PENDING' || rx.status === 'VERIFIED') && (
                        <button
                          className="btn btn-primary"
                          title="Dispense Medication"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/dispensing/${rx.id}`)}
                        >
                          <PackageCheck size={15} style={{ marginRight: '4px' }} />
                          Dispense
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PrescriptionListPage;
