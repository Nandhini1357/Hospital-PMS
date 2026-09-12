import React, { useState, useEffect } from 'react';
import batchApi from '../api/batchApi';
import drugApi from '../api/drugApi';
import supplierApi from '../api/supplierApi';
import { Plus, Layers, AlertCircle, RefreshCw, Trash2, Ban, Calendar, Clock, DollarSign, ArrowUpDown } from 'lucide-react';

const BatchManagementPage = () => {
  const [batches, setBatches] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [selectedDrug, setSelectedDrug] = useState('');
  const [fefoOnly, setFefoOnly] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    drugId: '',
    supplierId: '',
    batchNumber: '',
    quantity: 100,
    unitPrice: 10.0,
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [batchRes, drugRes, supRes] = await Promise.all([
        batchApi.getAll(),
        drugApi.getAll(),
        supplierApi.getAll(),
      ]);
      setBatches(batchRes.data || []);
      setDrugs(drugRes.data || []);
      setSuppliers(supRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory batches.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (drugId, isFefo) => {
    try {
      setLoading(true);
      setError('');
      if (drugId) {
        const res = isFefo ? await batchApi.getFefoByDrug(drugId) : await batchApi.getByDrug(drugId);
        setBatches(res.data || []);
      } else {
        const res = await batchApi.getAll();
        setBatches(res.data || []);
      }
    } catch (err) {
      setError('Failed to filter batches.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      drugId: drugs.length > 0 ? drugs[0].id : '',
      supplierId: suppliers.length > 0 ? suppliers[0].id : '',
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
      quantity: 100,
      unitPrice: 10.0,
      manufacturingDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        drugId: Number(formData.drugId),
        supplierId: formData.supplierId ? Number(formData.supplierId) : null,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      };
      await batchApi.create(payload);
      setSuccess(`Batch '${formData.batchNumber}' created successfully!`);
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create batch record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = async (id, batchNo) => {
    if (!window.confirm(`Are you sure you want to mark batch '${batchNo}' as DISCARDED?`)) return;
    try {
      await batchApi.discard(id);
      setSuccess(`Batch '${batchNo}' marked as DISCARDED.`);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to discard batch.');
    }
  };

  const handleDelete = async (id, batchNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete batch '${batchNo}'?`)) return;
    try {
      await batchApi.delete(id);
      setSuccess(`Batch '${batchNo}' deleted.`);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete batch.');
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={28} color="var(--primary-accent)" />
            Batch Management & FEFO Tracking
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track medication batches, manufacturing/expiry dates, and First Expire First Out ordering.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchInitialData} className="btn btn-secondary" title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add New Batch
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && <div className="alert alert-success">{success}</div>}

      {/* Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <select
            className="form-select"
            value={selectedDrug}
            onChange={(e) => {
              setSelectedDrug(e.target.value);
              handleFilterChange(e.target.value, fefoOnly);
            }}
          >
            <option value="">All Drugs</option>
            {drugs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
          <input
            type="checkbox"
            checked={fefoOnly}
            onChange={(e) => {
              setFefoOnly(e.target.checked);
              handleFilterChange(selectedDrug, e.target.checked);
            }}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary-accent)' }}
          />
          <ArrowUpDown size={16} color="var(--primary-accent)" /> Enable Strict FEFO Order (Expiring First)
        </label>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading inventory batches...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Batch Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Drug</th>
                <th style={{ padding: '0.75rem 1rem' }}>Supplier</th>
                <th style={{ padding: '0.75rem 1rem' }}>Qty</th>
                <th style={{ padding: '0.75rem 1rem' }}>Unit Price</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mfg Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Expiry Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No batches found for selected filter.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => {
                  const isExpired = batch.status === 'EXPIRED';
                  const isLow = batch.status === 'LOW_STOCK';
                  const isDiscarded = batch.status === 'DISCARDED';

                  return (
                    <tr key={batch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--primary-accent)' }}>
                            {batch.batchNumber}
                          </span>
                          {batch.isNextToExpire && (
                            <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '0.1rem 0.35rem', borderRadius: '4px', marginTop: '0.2rem', display: 'inline-block', width: 'fit-content' }}>
                              ⚡ FEFO DISPENSE FIRST
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {batch.drugName} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({batch.drugCode})</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {batch.supplierName}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                        {batch.quantity}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        ${Number(batch.unitPrice).toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {batch.manufacturingDate}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isExpired ? '#f87171' : 'var(--text-primary)' }}>
                          <Calendar size={14} /> {batch.expiryDate}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: batch.daysToExpiry < 60 ? '#f59e0b' : 'var(--text-muted)' }}>
                          {batch.daysToExpiry <= 0 ? 'Expired' : `${batch.daysToExpiry} days left`}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            backgroundColor: isExpired
                              ? 'rgba(239,68,68,0.2)'
                              : isDiscarded
                              ? 'rgba(100,116,139,0.2)'
                              : isLow
                              ? 'rgba(245,158,11,0.2)'
                              : 'rgba(16,185,129,0.2)',
                            color: isExpired
                              ? '#f87171'
                              : isDiscarded
                              ? '#94a3b8'
                              : isLow
                              ? '#fbbf24'
                              : '#34d399',
                          }}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {!isDiscarded && (
                          <button
                            onClick={() => handleDiscard(batch.id, batch.batchNumber)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.5rem', fontSize: '0.8rem' }}
                            title="Discard Batch"
                          >
                            <Ban size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(batch.id, batch.batchNumber)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Delete Batch"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Batch Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.25rem' }}>Receive New Inventory Batch</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Drug Formulation *</label>
                  <select
                    className="form-select"
                    value={formData.drugId}
                    onChange={(e) => setFormData({ ...formData, drugId: e.target.value })}
                    required
                  >
                    <option value="">Select Drug</option>
                    {drugs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier / Vendor</label>
                  <select
                    className="form-select"
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Batch Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Manufacturing Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.manufacturingDate}
                    onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Receive Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagementPage;
