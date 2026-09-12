import React, { useState, useEffect } from 'react';
import medicationHistoryApi from '../api/medicationHistoryApi';
import { History, Search, Filter, RefreshCw, Pill } from 'lucide-react';

const MedicationHistoryPage = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await medicationHistoryApi.getAll();
      setHistoryList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredList = historyList.filter(h => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.patientName?.toLowerCase().includes(q) ||
      h.patientNumber?.toLowerCase().includes(q) ||
      h.drugName?.toLowerCase().includes(q) ||
      h.prescriptionNumber?.toLowerCase().includes(q) ||
      h.pharmacistName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="main-content">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Patient Medication History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Audit trail of all dispensed medications across patient profiles.</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Patient Name, Patient ID, Drug Name, RX Number, or Pharmacist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>
        <button className="btn btn-secondary" onClick={fetchHistory}>
          <RefreshCw size={16} />
        </button>
      </div>

      {/* History Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading medication history records...</div>
        ) : filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <History size={40} style={{ marginBottom: '0.5rem' }} />
            <p>No medication history records found.</p>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Dispensed Date</th>
                <th style={{ padding: '0.75rem' }}>Patient</th>
                <th style={{ padding: '0.75rem' }}>Prescription #</th>
                <th style={{ padding: '0.75rem' }}>Drug Name</th>
                <th style={{ padding: '0.75rem' }}>Dosage & Freq</th>
                <th style={{ padding: '0.75rem' }}>Qty Dispensed</th>
                <th style={{ padding: '0.75rem' }}>Dispensing Pharmacist</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>{new Date(h.dispensedDate).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>{h.patientName} ({h.patientNumber})</td>
                  <td style={{ padding: '0.75rem' }}>{h.prescriptionNumber}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{h.drugName} ({h.drugCode})</td>
                  <td style={{ padding: '0.75rem' }}>{h.dosage} - {h.frequency}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{h.quantityDispensed}</td>
                  <td style={{ padding: '0.75rem' }}>{h.pharmacistName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MedicationHistoryPage;
