import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import prescriptionApi from '../api/prescriptionApi';
import { PackageCheck, Clock, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

const PendingPrescriptionsPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await prescriptionApi.getPending();
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="main-content">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Pharmacist Dispensing Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pending & Verified e-prescriptions awaiting FEFO inventory batch allocation & dispensing.</p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading pending queue...</div>
        ) : prescriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '0.5rem' }} />
            <h3>No Pending Prescriptions</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>All e-prescriptions have been processed and dispensed.</p>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Prescription #</th>
                <th style={{ padding: '0.75rem' }}>Patient</th>
                <th style={{ padding: '0.75rem' }}>Doctor</th>
                <th style={{ padding: '0.75rem' }}>Items</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Stock Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx) => {
                const isFullyAvailable = rx.items?.every(i => i.isStockSufficient);
                return (
                  <tr key={rx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>{rx.prescriptionNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{rx.patientName} ({rx.patientNumber})</td>
                    <td style={{ padding: '0.75rem' }}>{rx.doctorName || 'Dr. Staff'}</td>
                    <td style={{ padding: '0.75rem' }}>{rx.items?.length || 0} line item(s)</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`status-badge ${rx.status?.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                        {rx.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {isFullyAvailable ? (
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>✓ Stock Ready</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <ShieldAlert size={14} /> Low Stock
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        onClick={() => navigate(`/dispensing/${rx.id}`)}
                      >
                        <PackageCheck size={16} />
                        <span>Process & Dispense</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingPrescriptionsPage;
