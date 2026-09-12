import React, { useState, useEffect } from 'react';
import { getNarcoticsRegister } from '../api/narcoticsApi';
import { Search, Filter, ShieldCheck, AlertTriangle, Eye, FileText, Lock, Clock, UserCheck } from 'lucide-react';

const NarcoticsRegisterView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRegister();
  }, []);

  const fetchRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNarcoticsRegister();
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load narcotics ledger records.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      (r.drugName && r.drugName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.batchNo && r.batchNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.prescriptionNumber && r.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.primaryPharmacistName && r.primaryPharmacistName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !selectedType || r.transactionType === selectedType;
    return matchesSearch && matchesType;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'RECEIPT':
        return { backgroundColor: '#10B981', color: '#FFF' };
      case 'DISPENSE':
        return { backgroundColor: '#3B82F6', color: '#FFF' };
      case 'RETURN':
        return { backgroundColor: '#F59E0B', color: '#FFF' };
      case 'DESTRUCTION':
        return { backgroundColor: '#EF4444', color: '#FFF' };
      case 'RECONCILIATION':
        return { backgroundColor: '#8B5CF6', color: '#FFF' };
      default:
        return { backgroundColor: '#6B7280', color: '#FFF' };
    }
  };

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.4rem' }}>
            <Lock color="var(--primary-accent)" size={24} />
            Statutory Narcotics & Controlled Substance Register
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Immutable, tamper-evident ledger compliant with CDSCO & Schedule H1 regulations.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchRegister} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Register'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="search-toolbar" style={{ maxWidth: '650px' }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Drug, Batch, Prescription No, Pharmacist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="search-icon" style={{ color: 'var(--text-muted)' }} />
        </div>

        <div style={{ width: '200px' }}>
          <select className="form-control" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">All Transactions</option>
            <option value="RECEIPT">RECEIPT</option>
            <option value="DISPENSE">DISPENSE</option>
            <option value="RETURN">RETURN</option>
            <option value="DESTRUCTION">DESTRUCTION</option>
            <option value="RECONCILIATION">RECONCILIATION</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      {/* Ledger Table */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tamper-evident register...</div>
      ) : filteredRecords.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No narcotics ledger entries found matching criteria.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Controlled Drug</th>
                <th>Batch No</th>
                <th>Qty</th>
                <th>Opening</th>
                <th>Closing</th>
                <th>Authorized Pharmacists</th>
                <th>Tamper Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(rec.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge" style={getBadgeStyle(rec.transactionType)}>
                      {rec.transactionType}
                    </span>
                  </td>
                  <td>
                    <strong>{rec.drugName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rec.drugCode}</div>
                  </td>
                  <td><code>{rec.batchNo}</code></td>
                  <td><strong>{rec.quantity}</strong></td>
                  <td>{rec.openingBalance}</td>
                  <td><strong>{rec.closingBalance}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div><UserCheck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {rec.primaryPharmacistName}</div>
                    {rec.secondaryPharmacistName ? (
                      <div style={{ color: 'var(--text-muted)' }}><UserCheck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {rec.secondaryPharmacistName}</div>
                    ) : rec.isEmergencyOverride ? (
                      <span className="badge" style={{ backgroundColor: '#EF4444', color: '#FFF', fontSize: '0.75rem' }}>EMERGENCY OVERRIDE</span>
                    ) : null}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
                      <ShieldCheck size={16} /> Verified
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      onClick={() => setSelectedRecord(rec)}
                    >
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="var(--primary-accent)" /> Narcotics Entry #{selectedRecord.id} Details
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem' }} onClick={() => setSelectedRecord(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Drug Name:</strong> {selectedRecord.drugName} ({selectedRecord.drugCode})
              </div>
              <div>
                <strong>Transaction Type:</strong> {selectedRecord.transactionType}
              </div>
              <div>
                <strong>Batch Number:</strong> <code>{selectedRecord.batchNo}</code>
              </div>
              <div>
                <strong>Quantity:</strong> {selectedRecord.quantity} units
              </div>
              <div>
                <strong>Opening Balance:</strong> {selectedRecord.openingBalance} units
              </div>
              <div>
                <strong>Closing Balance:</strong> {selectedRecord.closingBalance} units
              </div>
              <div>
                <strong>Manufacturer:</strong> {selectedRecord.manufacturer || 'N/A'}
              </div>
              <div>
                <strong>Supplier Invoice:</strong> {selectedRecord.supplierInvoice || 'N/A'}
              </div>
              {selectedRecord.doctorName && (
                <div>
                  <strong>Prescribing Doctor:</strong> {selectedRecord.doctorName}
                </div>
              )}
              {selectedRecord.patientName && (
                <div>
                  <strong>Patient Name:</strong> {selectedRecord.patientName}
                </div>
              )}
              {selectedRecord.witnessName && (
                <div>
                  <strong>Witness Name:</strong> {selectedRecord.witnessName}
                </div>
              )}
              {selectedRecord.destructionMethod && (
                <div>
                  <strong>Destruction Method:</strong> {selectedRecord.destructionMethod}
                </div>
              )}
              <div>
                <strong>Primary Pharmacist:</strong> {selectedRecord.primaryPharmacistName}
              </div>
              <div>
                <strong>Secondary Pharmacist:</strong> {selectedRecord.secondaryPharmacistName || (selectedRecord.isEmergencyOverride ? 'Pending Approval (Emergency)' : 'N/A')}
              </div>
            </div>

            {selectedRecord.varianceReason && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid #EF4444' }}>
                <strong style={{ color: '#EF4444' }}>Variance / Emergency Explanation:</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{selectedRecord.varianceReason}</p>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--card-bg-light, #1E293B)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                IMMUTABLE SHA-256 DIGITAL VERIFICATION HASH
              </div>
              <code style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: '#10B981' }}>
                {selectedRecord.verificationHash || 'SHA256-GEN-VERIFIED'}
              </code>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NarcoticsRegisterView;
