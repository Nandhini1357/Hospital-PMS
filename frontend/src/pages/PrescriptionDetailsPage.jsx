import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import prescriptionApi from '../api/prescriptionApi';
import dispensingApi from '../api/dispensingApi';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, PackageCheck, AlertTriangle, XCircle, User, FileText, Calendar } from 'lucide-react';

const PrescriptionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [stockCheck, setStockCheck] = useState(null);
  const [dispensingRecord, setDispensingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [rxRes, stockRes] = await Promise.all([
        prescriptionApi.getById(id),
        prescriptionApi.checkStock(id)
      ]);
      setPrescription(rxRes.data);
      setStockCheck(stockRes.data);

      if (rxRes.data.status === 'DISPENSED') {
        try {
          const dispRes = await dispensingApi.getByPrescriptionId(id);
          setDispensingRecord(dispRes.data);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch prescription details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleVerify = async () => {
    try {
      await prescriptionApi.verify(id);
      setActionSuccess('Prescription verified by Pharmacist.');
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify prescription.');
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Please enter cancellation reason:');
    if (reason === null) return;
    try {
      await prescriptionApi.cancel(id, reason);
      setActionSuccess('Prescription cancelled.');
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel prescription.');
    }
  };

  if (loading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '3rem' }}>Loading prescription details...</div>;
  }

  if (!prescription) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#ef4444' }}>Prescription record not found.</p>
        <Link to="/prescriptions" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Prescriptions</Link>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/prescriptions')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Queue</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {user?.role === 'PHARMACIST' && prescription.status === 'PENDING' && (
            <button className="btn btn-secondary" onClick={handleVerify} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#3b82f6" />
              <span>Verify RX</span>
            </button>
          )}

          {user?.role === 'PHARMACIST' && (prescription.status === 'PENDING' || prescription.status === 'VERIFIED') && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/dispensing/${prescription.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <PackageCheck size={16} />
              <span>Dispense Medication</span>
            </button>
          )}

          {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && prescription.status !== 'DISPENSED' && prescription.status !== 'CANCELLED' && (
            <button className="btn btn-secondary" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444' }}>
              <XCircle size={16} />
              <span>Cancel RX</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981' }}>
          {actionSuccess}
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-Prescription Header</span>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-accent)', margin: '0.2rem 0' }}>{prescription.prescriptionNumber}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Created on: {new Date(prescription.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className={`status-badge ${prescription.status?.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
              {prescription.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Patient Details
            </h3>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{prescription.patientName}</p>
            <p>ID: {prescription.patientNumber}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} /> Prescribing Doctor
            </h3>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{prescription.doctorName || 'Dr. Staff'}</p>
            <p>Notes: {prescription.notes || 'None'}</p>
          </div>
        </div>
      </div>

      {/* FEFO Stock Availability Banner */}
      {stockCheck && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: stockCheck.isFullyAvailable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${stockCheck.isFullyAvailable ? '#10b981' : '#ef4444'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {stockCheck.isFullyAvailable ? <CheckCircle color="#10b981" size={24} /> : <AlertTriangle color="#ef4444" size={24} />}
          <div>
            <h4 style={{ fontWeight: 'bold', color: stockCheck.isFullyAvailable ? '#10b981' : '#ef4444' }}>
              {stockCheck.isFullyAvailable ? 'FEFO Inventory Stock Confirmed Available' : 'Insufficient Inventory Stock Warning'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stockCheck.isFullyAvailable
                ? 'All prescribed medicines have adequate unexpired stock in FEFO batches to dispense.'
                : 'One or more prescribed drugs do not have sufficient unexpired batch stock available.'}
            </p>
          </div>
        </div>
      )}

      {/* Prescribed Items Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Prescribed Items</h2>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Drug Name</th>
              <th style={{ padding: '0.75rem' }}>Dosage</th>
              <th style={{ padding: '0.75rem' }}>Frequency</th>
              <th style={{ padding: '0.75rem' }}>Duration</th>
              <th style={{ padding: '0.75rem' }}>Required Qty</th>
              <th style={{ padding: '0.75rem' }}>Unexpired Stock</th>
              <th style={{ padding: '0.75rem' }}>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {prescription.items.map((item) => {
              const stockInfo = stockCheck?.items?.find(s => s.id === item.id);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.drugName} ({item.drugCode})</td>
                  <td style={{ padding: '0.75rem' }}>{item.dosage}</td>
                  <td style={{ padding: '0.75rem' }}>{item.frequency}</td>
                  <td style={{ padding: '0.75rem' }}>{item.duration}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {stockInfo ? (
                      <span style={{ color: stockInfo.isStockSufficient ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                        {stockInfo.availableStock} {item.unit} {stockInfo.isStockSufficient ? '✓' : '✗ Insufficient'}
                      </span>
                    ) : 'Checking...'}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{item.instructions || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dispensing Audit Log if Dispensed */}
      {dispensingRecord && (
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b981' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: '0.5rem' }}>Dispensing Completion Record</h2>
          <p style={{ margin: '0.2rem 0' }}>Dispensing ID: <strong>{dispensingRecord.dispensingNumber}</strong></p>
          <p style={{ margin: '0.2rem 0' }}>Dispensed By Pharmacist: <strong>{dispensingRecord.pharmacistName}</strong></p>
          <p style={{ margin: '0.2rem 0' }}>Dispensed Timestamp: {new Date(dispensingRecord.dispensedAt).toLocaleString()}</p>
          {dispensingRecord.notes && <p style={{ margin: '0.2rem 0' }}>Pharmacist Notes: {dispensingRecord.notes}</p>}
        </div>
      )}
    </div>
  );
};

export default PrescriptionDetailsPage;
