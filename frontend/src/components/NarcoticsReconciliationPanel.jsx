import React, { useState, useEffect } from 'react';
import { getNarcoticsBalance, reconcileNarcoticsStock } from '../api/narcoticsApi';
import axiosInstance from '../api/axiosConfig';
import { Scale, AlertTriangle, CheckCircle, RefreshCw, Lock } from 'lucide-react';

const NarcoticsReconciliationPanel = () => {
  const [drugs, setDrugs] = useState([]);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [batchNo, setBatchNo] = useState('');

  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const [physicalClosingBalance, setPhysicalClosingBalance] = useState('');
  const [varianceReason, setVarianceReason] = useState('');

  const [pharmacistId, setPharmacistId] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrugs();
  }, []);

  useEffect(() => {
    if (selectedDrugId) {
      fetchBalance(selectedDrugId, batchNo);
    }
  }, [selectedDrugId, batchNo]);

  const fetchDrugs = async () => {
    try {
      const response = await axiosInstance.get('/api/drugs');
      setDrugs(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedDrugId(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load drugs list:', err);
    }
  };

  const fetchBalance = async (drugId, bNo) => {
    setLoadingBalance(true);
    setError(null);
    try {
      const data = await getNarcoticsBalance(drugId, bNo);
      setBalance(data);
      if (physicalClosingBalance === '') {
        setPhysicalClosingBalance(data.physicalStock);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch drug stock balance.');
    } finally {
      setLoadingBalance(false);
    }
  };

  // Calculations
  const expectedClosing = balance ? balance.expectedClosingStock : 0;
  const physicalNum = physicalClosingBalance !== '' ? Number(physicalClosingBalance) : expectedClosing;
  const rawVariance = Math.abs(physicalNum - expectedClosing);
  const variancePct = expectedClosing > 0 ? ((rawVariance / expectedClosing) * 100).toFixed(2) : (physicalNum > 0 ? '100.00' : '0.00');
  const isVarianceFlagged = Number(variancePct) > 2.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!pharmacistId) {
      setError('Pharmacist User ID is required to execute reconciliation.');
      return;
    }

    if (isVarianceFlagged && !varianceReason.trim()) {
      setError(`Stock variance is ${variancePct}%, which exceeds the 2.0% statutory threshold. A mandatory variance explanation is required for supervisor escalation.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        drugId: Number(selectedDrugId),
        batchNo: batchNo || 'SHIFT_END_RECONCILIATION',
        physicalClosingBalance: physicalNum,
        varianceReason: isVarianceFlagged ? varianceReason : (varianceReason || 'Shift-End Reconciliation Normal'),
        pharmacistId: Number(pharmacistId),
        digitalSig: `DSIG-RECON-${pharmacistId}-${Date.now()}`
      };

      const result = await reconcileNarcoticsStock(payload);
      setMessage({
        type: isVarianceFlagged ? 'warning' : 'success',
        text: `Reconciliation logged successfully (Record #${result.id}). Physical Stock: ${result.closingBalance} units.` +
          (isVarianceFlagged ? ` [FLAGGED FOR ESCALATION: Variance ${variancePct}%]` : '')
      });

      // Refresh balance
      fetchBalance(selectedDrugId, batchNo);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit stock reconciliation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.4rem' }}>
          <Scale color="var(--primary-accent)" size={24} /> Shift-End Narcotics Stock Reconciliation Panel
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Compare physical stock against ledger expected balance: <code>Expected = Opening Stock - Dispensed + Received</code>
        </p>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'warning' ? 'warning' : 'success'}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Form Column */}
        <div>
          <div className="form-group">
            <label>Select Controlled Drug *</label>
            <select
              className="form-control"
              value={selectedDrugId}
              onChange={(e) => setSelectedDrugId(e.target.value)}
            >
              {drugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code}) {d.isScheduleH1 ? '[Schedule H1]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Batch Number (Optional - leave blank for all batches)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BATCH-MORPH-001"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Physical Closing Balance Count *</label>
            <input
              type="number"
              className="form-control"
              value={physicalClosingBalance}
              onChange={(e) => setPhysicalClosingBalance(e.target.value)}
              min={0}
              required
            />
          </div>

          {isVarianceFlagged && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--alert-error-text)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} /> Variance Exceeds 2.0% Threshold ({variancePct}%) — Supervisor Escalation Required
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--alert-error-text)' }}>Mandatory Variance Explanation *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Provide mandatory explanation for the stock discrepancy for supervisor audit escalation..."
                  value={varianceReason}
                  onChange={(e) => setVarianceReason(e.target.value)}
                  required={isVarianceFlagged}
                />
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={16} /> Reconciling Pharmacist Authentication
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Pharmacist User ID *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 1"
                  value={pharmacistId}
                  onChange={(e) => setPharmacistId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Password / Signature Token</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || loadingBalance}
              style={{ width: '100%', marginTop: '1.25rem', backgroundColor: isVarianceFlagged ? 'var(--danger-color)' : 'var(--primary-accent)' }}
            >
              {submitting ? 'Submitting Reconciliation...' : isVarianceFlagged ? 'Submit Reconciliation & Escalate Variance' : 'Submit Reconciliation'}
            </button>
          </div>
        </div>

        {/* Right Balance Summary Column */}
        <div>
          {loadingBalance ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating stock balance...</div>
          ) : balance ? (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--glass-shadow)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                Stock Balance Calculation Formula
              </h3>

              <div style={{ marginBottom: '1.25rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--subtle-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginRight: '0.4rem' }}>Formula:</span>
                <code style={{ color: 'var(--primary-accent)', fontWeight: 700, fontSize: '0.875rem' }}>Expected = Opening Stock - Dispensed + Received</code>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Total Received Stock (+):</span>
                  <strong style={{ color: 'var(--success-color)', fontSize: '1rem' }}>+{balance.totalReceived} units</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Total Dispensed Stock (-):</span>
                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1rem' }}>-{balance.totalDispensed} units</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Total Destroyed / Returned (-):</span>
                  <strong style={{ color: 'var(--danger-color)', fontSize: '1rem' }}>-{balance.totalDestroyed + balance.totalReturned} units</strong>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.025rem' }}>Expected Closing Stock:</span>
                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.05rem' }}>{balance.expectedClosingStock} units</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.025rem' }}>Entered Physical Stock:</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{physicalNum} units</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.025rem' }}>Calculated Variance:</span>
                  <strong style={{ color: isVarianceFlagged ? 'var(--danger-color)' : 'var(--success-color)', fontSize: '1.05rem', fontWeight: 700 }}>{rawVariance} units ({variancePct}%)</strong>
                </div>

                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isVarianceFlagged ? 'var(--alert-error-bg)' : 'var(--alert-success-bg)',
                  border: `1px solid ${isVarianceFlagged ? 'var(--alert-error-border)' : 'var(--alert-success-border)'}`
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    color: isVarianceFlagged ? 'var(--alert-error-text)' : 'var(--alert-success-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {isVarianceFlagged ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                    {isVarianceFlagged ? 'Variance Flagged (> 2.0%)' : 'Variance Within Allowable Range (≤ 2.0%)'}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    marginTop: '0.35rem',
                    color: isVarianceFlagged ? 'var(--alert-error-text)' : 'var(--alert-success-text)',
                    lineHeight: 1.4
                  }}>
                    {isVarianceFlagged
                      ? 'Requires mandatory explanation and supervisor escalation flag.'
                      : 'Physical count matches expected ledger balance within statutory tolerance.'}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NarcoticsReconciliationPanel;
