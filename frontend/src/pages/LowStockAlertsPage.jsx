import React, { useState, useEffect } from 'react';
import inventoryApi from '../api/inventoryApi';
import { AlertTriangle, Plus, RefreshCw, PackageCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LowStockAlertsPage = () => {
  const [lowStockDrugs, setLowStockDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await inventoryApi.getLowStockAlerts();
      setLowStockDrugs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch low stock alerts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <AlertTriangle size={28} color="#ef4444" />
            Low Stock Inventory Alerts
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Medications requiring urgent replenishment because stock has fallen to or below reorder levels.
          </p>
        </div>
        <button onClick={fetchLowStock} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh Alerts
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Checking inventory thresholds...</p>
        </div>
      ) : lowStockDrugs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <PackageCheck size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#34d399' }}>All Stock Levels Optimal!</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            No medications are currently below their safety reorder thresholds.
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Drug Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Drug Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Current Stock</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reorder Threshold</th>
                <th style={{ padding: '0.75rem 1rem' }}>Deficit</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockDrugs.map((drug) => {
                const stock = drug.totalStock || 0;
                const reorder = drug.reorderLevel;
                const deficit = Math.max(0, reorder - stock);

                return (
                  <tr key={drug.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#f87171', fontWeight: 600 }}>
                      {drug.code}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {drug.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {drug.categoryName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          backgroundColor: 'rgba(239, 68, 68, 0.25)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        {stock} {drug.unit}s
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {reorder} {drug.unit}s
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#fbbf24', fontWeight: '600' }}>
                      +{deficit} needed
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate('/inventory/batches')}
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <Plus size={14} /> Receive New Batch <ArrowUpRight size={14} />
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

export default LowStockAlertsPage;
