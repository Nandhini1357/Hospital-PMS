import React, { useState, useEffect } from 'react';
import inventoryApi from '../api/inventoryApi';
import {
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  Tag,
  Truck,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Layers,
  CheckCircle2,
  List
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await inventoryApi.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading Pharmacy Inventory Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={28} color="var(--primary-accent)" />
            Pharmacy Inventory & FEFO Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Phase 2: Master Catalog, Batch Control, Expiration Monitoring & Safety Thresholds.
          </p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Quick Access Navigation Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Quick Workspaces:
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/inventory/drugs" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <List size={14} /> Drug Master Catalog
          </Link>
          <Link to="/inventory/batches" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Layers size={14} /> Batch Management (FEFO)
          </Link>
          <Link to="/inventory/categories" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Tag size={14} /> Drug Categories
          </Link>
          <Link to="/inventory/suppliers" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Truck size={14} /> Suppliers
          </Link>
          <Link to="/inventory/low-stock" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', color: '#f87171' }}>
            <AlertTriangle size={14} /> Low Stock ({dashboard?.lowStockDrugCount || 0})
          </Link>
          <Link to="/inventory/expiry-alerts" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', color: '#fbbf24' }}>
            <Clock size={14} /> Expiry Risk ({dashboard?.expiringSoonBatchCount || 0})
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px' }}>
            <Package size={32} color="var(--primary-accent)" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Registered Drugs</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{dashboard?.totalDrugs || 0}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Across {dashboard?.totalCategories || 0} categories
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px' }}>
            <Layers size={32} color="#10b981" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Units in Stock</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#34d399' }}>
              {dashboard?.totalStockQuantity || 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              In {dashboard?.totalBatches || 0} active batches
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px' }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Low Stock Alerts</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#f87171' }}>
              {dashboard?.lowStockDrugCount || 0}
            </h2>
            <Link to="/inventory/low-stock" style={{ fontSize: '0.75rem', color: '#fca5a5', textDecoration: 'underline' }}>
              View Low Stock Drugs →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '12px' }}>
            <Clock size={32} color="#f59e0b" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expiring Soon (60 Days)</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#fbbf24' }}>
              {dashboard?.expiringSoonBatchCount || 0}
            </h2>
            <Link to="/inventory/expiry-alerts" style={{ fontSize: '0.75rem', color: '#fde68a', textDecoration: 'underline' }}>
              View FEFO Expiry Alerts →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
            <Clock size={32} color="#ef4444" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expired Batches</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#f87171' }}>
              {dashboard?.expiredBatchCount || 0}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require immediate discard</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '12px' }}>
            <DollarSign size={32} color="#a855f7" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Inventory Valuation</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#c084fc' }}>
              ${Number(dashboard?.totalInventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unexpired stock value</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & FEFO Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Low Stock Preview Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
              <AlertTriangle size={18} /> Low Stock Warnings
            </h3>
            <Link to="/inventory/low-stock" style={{ color: 'var(--primary-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
              View All Low Stock ({dashboard?.lowStockDrugCount || 0}) →
            </Link>
          </div>

          {(!dashboard?.lowStockDrugs || dashboard.lowStockDrugs.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
              No low stock warnings. All medications meet reorder levels.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.5rem' }}>Drug</th>
                  <th style={{ padding: '0.5rem' }}>Code</th>
                  <th style={{ padding: '0.5rem' }}>Current Stock</th>
                  <th style={{ padding: '0.5rem' }}>Reorder Threshold</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.lowStockDrugs.slice(0, 5).map((drug) => (
                  <tr key={drug.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{drug.name}</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', color: '#f87171' }}>{drug.code}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#fca5a5', fontWeight: 700 }}>
                      {drug.totalStock || 0} {drug.unit}s
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>{drug.reorderLevel} {drug.unit}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Category Breakdown Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} color="var(--primary-accent)" /> Categories Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dashboard?.categoryBreakdown && Object.keys(dashboard.categoryBreakdown).length > 0 ? (
              Object.entries(dashboard.categoryBreakdown).map(([catName, count]) => (
                <div key={catName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{catName}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderRadius: '9999px' }}>
                    {count} drugs
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No categories registered yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Expiring Soon Preview Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Clock size={18} /> Near-Expiry Batches (FEFO Dispensing Priority)
          </h3>
          <Link to="/inventory/expiry-alerts" style={{ color: 'var(--primary-accent)', fontSize: '0.85rem', textDecoration: 'none' }}>
            View Full Expiry Risk Report →
          </Link>
        </div>

        {(!dashboard?.expiringBatches || dashboard.expiringBatches.length === 0) ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
            No batches expiring within the next 60 days.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Batch #</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Drug Name</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Quantity</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Expiry Date</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Days Left</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.expiringBatches.slice(0, 5).map((batch) => (
                <tr key={batch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.6rem 0.5rem', fontFamily: 'monospace', color: 'var(--primary-accent)', fontWeight: 600 }}>
                    {batch.batchNumber}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', fontWeight: 500 }}>{batch.drugName}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{batch.quantity}</td>
                  <td style={{ padding: '0.6rem 0.5rem', color: '#fbbf24' }}>{batch.expiryDate}</td>
                  <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600, color: '#fbbf24' }}>{batch.daysToExpiry} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
