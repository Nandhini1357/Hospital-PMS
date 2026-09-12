import React, { useState, useEffect } from 'react';
import inventoryApi from '../api/inventoryApi';
import batchApi from '../api/batchApi';
import { Clock, Ban, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

const ExpiryAlertsPage = () => {
  const [batches, setBatches] = useState([]);
  const [daysFilter, setDaysFilter] = useState(60);
  const [viewExpired, setViewExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [daysFilter, viewExpired]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      if (viewExpired) {
        const res = await inventoryApi.getExpiredBatches();
        setBatches(res.data || []);
      } else {
        const res = await inventoryApi.getExpiryAlerts(daysFilter);
        setBatches(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expiry alerts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async (id, batchNo) => {
    if (!window.confirm(`Are you sure you want to discard expired batch '${batchNo}'?`)) return;
    try {
      await batchApi.discard(id);
      setSuccess(`Batch '${batchNo}' marked as DISCARDED.`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to discard batch.');
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: viewExpired ? '#ef4444' : '#f59e0b' }}>
            <Clock size={28} color={viewExpired ? '#ef4444' : '#f59e0b'} />
            Expiry Risk & FEFO Alerts
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Monitor batches approaching expiration to enforce First Expire, First Out dispensing or discard invalid stock.
          </p>
        </div>
        <button onClick={fetchData} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && <div className="alert alert-success">{success}</div>}

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setViewExpired(false);
              setDaysFilter(30);
            }}
            className={`btn ${!viewExpired && daysFilter === 30 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Expiring in 30 Days
          </button>
          <button
            onClick={() => {
              setViewExpired(false);
              setDaysFilter(60);
            }}
            className={`btn ${!viewExpired && daysFilter === 60 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Expiring in 60 Days
          </button>
          <button
            onClick={() => {
              setViewExpired(false);
              setDaysFilter(90);
            }}
            className={`btn ${!viewExpired && daysFilter === 90 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Expiring in 90 Days
          </button>
          <button
            onClick={() => setViewExpired(true)}
            className={`btn ${viewExpired ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Expired Batches
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Scanning batch expiration dates...</p>
        </div>
      ) : batches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#34d399' }}>
            {viewExpired ? 'No Expired Batches Found!' : `No Batches Expiring Within ${daysFilter} Days`}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Your inventory is compliant with FEFO shelf-life requirements.
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Batch Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Drug Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Quantity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Supplier</th>
                <th style={{ padding: '0.75rem 1rem' }}>Expiry Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Days Remaining</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const isExpired = batch.status === 'EXPIRED' || batch.daysToExpiry <= 0;
                return (
                  <tr key={batch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--primary-accent)', fontWeight: 600 }}>
                      {batch.batchNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {batch.drugName} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({batch.drugCode})</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                      {batch.quantity}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {batch.supplierName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: isExpired ? '#f87171' : 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {batch.expiryDate}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: isExpired ? '#f87171' : '#fbbf24' }}>
                      {batch.daysToExpiry <= 0 ? 'Expired' : `${batch.daysToExpiry} days`}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: isExpired ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: isExpired ? '#f87171' : '#fbbf24',
                        }}
                      >
                        {isExpired ? 'EXPIRED' : 'EXPIRING SOON'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDiscard(batch.id, batch.batchNumber)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                      >
                        <Ban size={14} /> Discard Batch
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlertsPage;
