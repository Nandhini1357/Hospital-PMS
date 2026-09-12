import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import prescriptionApi from '../api/prescriptionApi';
import dispensingApi from '../api/dispensingApi';
import batchApi from '../api/batchApi';
import DualAuthDispenseModal from '../components/DualAuthDispenseModal';
import { PackageCheck, ArrowLeft, CheckCircle, AlertTriangle, Info, ShieldCheck, Lock } from 'lucide-react';

const DispensingPage = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState(null);
  const [fefoBatchesMap, setFefoBatchesMap] = useState({});
  const [dispensingNotes, setDispensingNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);
  const [error, setError] = useState('');
  const [lowStockWarnings, setLowStockWarnings] = useState([]);
  const [narcoticModalItem, setNarcoticModalItem] = useState(null);

  useEffect(() => {
    const fetchDispensingData = async () => {
      setLoading(true);
      try {
        const rxRes = await prescriptionApi.getById(prescriptionId);
        const rxData = rxRes.data;
        setPrescription(rxData);

        // Fetch FEFO batches for each drug in prescription
        const batchesMap = {};
        for (const item of rxData.items) {
          try {
            const batchRes = await batchApi.getFefoByDrug(item.drugId);
            batchesMap[item.drugId] = batchRes.data;
          } catch (e) {
            batchesMap[item.drugId] = [];
          }
        }
        setFefoBatchesMap(batchesMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load prescription dispensing data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDispensingData();
  }, [prescriptionId]);

  const handleConfirmDispense = async () => {
    setError('');
    setDispensing(true);
    try {
      const payload = {
        prescriptionId: Number(prescriptionId),
        notes: dispensingNotes || 'Dispensed as prescribed.'
      };

      const res = await dispensingApi.dispense(payload);

      if (res.data.lowStockAlerts && res.data.lowStockAlerts.length > 0) {
        setLowStockWarnings(res.data.lowStockAlerts);
      }

      alert(`Prescription ${prescription.prescriptionNumber} successfully dispensed! Dispensing ID: ${res.data.dispensingNumber}`);
      navigate(`/prescriptions/${prescriptionId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Dispensing failed. Please check stock availability.');
    } finally {
      setDispensing(false);
    }
  };

  if (loading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '3rem' }}>Loading FEFO dispensing workspace...</div>;
  }

  if (!prescription) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>Prescription not found.</div>;
  }

  const allItemsSufficient = prescription.items?.every(i => i.isStockSufficient);

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/prescriptions/pending')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Pending Queue</span>
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>FEFO Automated Batch Allocation Workspace</span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Prescription Header Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--primary-accent)' }}>Dispense RX: {prescription.prescriptionNumber}</h1>
            <p style={{ marginTop: '0.2rem' }}>Patient: <strong>{prescription.patientName}</strong> ({prescription.patientNumber})</p>
            <p style={{ color: 'var(--text-secondary)' }}>Prescribing Doctor: {prescription.doctorName || 'Dr. Staff'}</p>
          </div>
          <div>
            <span className={`status-badge ${prescription.status?.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '15px' }}>
              {prescription.status}
            </span>
          </div>
        </div>
      </div>

      {/* FEFO Batch Allocation & Inventory Validation */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck color="#10b981" size={20} />
          <span>FEFO Inventory Batch Allocation Breakdown</span>
        </h2>

        {prescription.items.map((item) => {
          const fefoBatches = fefoBatchesMap[item.drugId] || [];
          return (
            <div key={item.id} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{item.drugName} ({item.drugCode})</span>
                <span style={{ color: item.isStockSufficient ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                  Required: {item.quantity} {item.unit} | Available Unexpired Stock: {item.availableStock} {item.unit}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Dosage: {item.dosage} | Frequency: {item.frequency} | Duration: {item.duration}
              </p>

              {/* Batches Table */}
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>FEFO Selected Unexpired Batches:</span>
                {fefoBatches.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '0.2rem' }}>No unexpired stock batches available for this drug!</p>
                ) : (
                  <table className="data-table" style={{ width: '100%', marginTop: '0.3rem', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '0.4rem' }}>Batch #</th>
                        <th style={{ padding: '0.4rem' }}>Expiry Date</th>
                        <th style={{ padding: '0.4rem' }}>Batch Qty</th>
                        <th style={{ padding: '0.4rem' }}>FEFO Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fefoBatches.map((b, bIdx) => (
                        <tr key={b.id}>
                          <td style={{ padding: '0.4rem', fontWeight: 'bold' }}>{b.batchNumber}</td>
                          <td style={{ padding: '0.4rem', color: b.daysToExpiry <= 30 ? '#f59e0b' : 'inherit' }}>
                            {b.expiryDate} ({b.daysToExpiry} days left)
                          </td>
                          <td style={{ padding: '0.4rem' }}>{b.quantity} {item.unit}</td>
                          <td style={{ padding: '0.4rem' }}>
                            {bIdx === 0 ? (
                              <span style={{ color: '#10b981', fontWeight: 'bold' }}>1st Priority (Earliest Expiry)</span>
                            ) : (
                              <span>Priority #{bIdx + 1}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispensing Action Form */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pharmacist Verification & Dispensing Execution</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label className="form-label">Pharmacist Dispensing Notes</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="e.g. Verified dosage instructions with patient. Dispensed from Batch BATCH-EARLY-01."
            value={dispensingNotes}
            onChange={(e) => setDispensingNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {allItemsSufficient ? (
              <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={18} /> Ready for instant stock deduction & dispensing
              </span>
            ) : (
              <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={18} /> Cannot dispense due to unexpired stock shortage
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              disabled={dispensing || !allItemsSufficient || !prescription.items || prescription.items.length === 0}
              onClick={() => setNarcoticModalItem(prescription.items[0])}
              style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)' }}
            >
              <Lock size={18} />
              <span>Dual-Auth Narcotic Dispense</span>
            </button>

            <button
              className="btn btn-primary"
              disabled={dispensing || !allItemsSufficient}
              onClick={handleConfirmDispense}
              style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PackageCheck size={18} />
              <span>{dispensing ? 'Deducting Stock & Dispensing...' : 'Confirm Standard Dispensing'}</span>
            </button>
          </div>
        </div>
      </div>

      {narcoticModalItem && (
        <DualAuthDispenseModal
          prescription={prescription}
          drugItem={narcoticModalItem}
          onClose={() => setNarcoticModalItem(null)}
          onSuccess={() => {
            alert(`Controlled substance prescription ${prescription.prescriptionNumber} successfully dispensed with statutory register logging!`);
            navigate(`/prescriptions/${prescriptionId}`);
          }}
        />
      )}
    </div>
  );
};

export default DispensingPage;
