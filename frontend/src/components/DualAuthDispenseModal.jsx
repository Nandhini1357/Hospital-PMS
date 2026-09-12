import React, { useState } from 'react';
import { dispenseNarcotics } from '../api/narcoticsApi';
import { ShieldCheck, AlertTriangle, Lock, UserCheck, Key } from 'lucide-react';

const DualAuthDispenseModal = ({ prescription, drugItem, onClose, onSuccess }) => {
  const [isEmergency, setIsEmergency] = useState(false);

  // Pharmacist Credentials & Digital Signatures
  const [primaryPharmacistId, setPrimaryPharmacistId] = useState('');
  const [primaryPassword, setPrimaryPassword] = useState('');
  const [primaryDigitalSig, setPrimaryDigitalSig] = useState('');

  const [secondaryPharmacistId, setSecondaryPharmacistId] = useState('');
  const [secondaryPassword, setSecondaryPassword] = useState('');
  const [secondaryDigitalSig, setSecondaryDigitalSig] = useState('');

  const [emergencyReason, setEmergencyReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!primaryPharmacistId) {
      setError('Primary Pharmacist User ID is required.');
      return;
    }

    if (isEmergency) {
      if (!emergencyReason.trim()) {
        setError('Emergency single-pharmacist override requires a mandatory justification reason.');
        return;
      }
    } else {
      if (!secondaryPharmacistId) {
        setError('Secondary Pharmacist User ID is required for standard controlled substance dispensing.');
        return;
      }
      if (primaryPharmacistId === secondaryPharmacistId) {
        setError('Primary and Secondary Pharmacists must be two distinct individuals.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        prescriptionId: prescription.id,
        drugId: drugItem.drugId || drugItem.drug?.id,
        batchNo: drugItem.batchNo || '',
        quantity: drugItem.quantity,
        primaryPharmacistId: Number(primaryPharmacistId),
        primaryPassword,
        primaryDigitalSig: primaryDigitalSig || `DSIG-P1-${primaryPharmacistId}-${Date.now()}`,
        secondaryPharmacistId: secondaryPharmacistId ? Number(secondaryPharmacistId) : null,
        secondaryPassword,
        secondaryDigitalSig: secondaryDigitalSig || (secondaryPharmacistId ? `DSIG-P2-${secondaryPharmacistId}-${Date.now()}` : ''),
        isEmergencyOverride: isEmergency,
        emergencyReason: isEmergency ? emergencyReason : ''
      };

      const result = await dispenseNarcotics(payload);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Dual-authorization failed or invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="card" style={{ width: '95%', maxWidth: '600px', maxHeight: '95vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={22} /> Dual-Pharmacist Authorization Required
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem' }} onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #F59E0B', borderRadius: '6px', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, color: '#F59E0B', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} /> Schedule H1 / Controlled Substance Security Protocol
          </div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Dispensing <strong>{drugItem.drugName || drugItem.drug?.name}</strong> (Qty: {drugItem.quantity}) under Rx #{prescription.prescriptionNumber}.
          </div>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Mode Switcher */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: !isEmergency ? 600 : 400 }}>
              <input
                type="radio"
                name="authMode"
                checked={!isEmergency}
                onChange={() => setIsEmergency(false)}
              />
              Dual-Pharmacist Authorization (Standard)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#EF4444', fontWeight: isEmergency ? 600 : 400 }}>
              <input
                type="radio"
                name="authMode"
                checked={isEmergency}
                onChange={() => setIsEmergency(true)}
              />
              Emergency Override (Single Pharmacist)
            </label>
          </div>

          {/* Primary Pharmacist Section */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={16} color="#10B981" /> Primary Pharmacist Authentication
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Primary User ID *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 1"
                  value={primaryPharmacistId}
                  onChange={(e) => setPrimaryPharmacistId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Password / Signature Token</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={primaryPassword}
                  onChange={(e) => setPrimaryPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Secondary Pharmacist Section (if not emergency) */}
          {!isEmergency ? (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={16} color="#3B82F6" /> Secondary Pharmacist Authorization
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Secondary User ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2"
                    value={secondaryPharmacistId}
                    onChange={(e) => setSecondaryPharmacistId(e.target.value)}
                    required={!isEmergency}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>Password / Signature Token</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={secondaryPassword}
                    onChange={(e) => setSecondaryPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid #EF4444', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#EF4444', fontSize: '0.95rem' }}>
                Emergency Single-Pharmacist Justification
              </h4>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Emergency Reason *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Detail the emergency justification (e.g. Trauma unit emergency, secondary pharmacist unavailable)..."
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  required={isEmergency}
                />
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                * Emergency single-pharmacist dispenses are logged for retrospective senior-pharmacist audit approval.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ backgroundColor: isEmergency ? '#EF4444' : 'var(--primary-accent)' }}>
              {submitting ? 'Authenticating & Registering...' : isEmergency ? 'Authorize Emergency Override' : 'Authorize & Dispense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DualAuthDispenseModal;
