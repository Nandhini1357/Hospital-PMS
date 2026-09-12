import React, { useState, useEffect } from 'react';
import supplierApi from '../api/supplierApi';
import { Plus, Edit2, Trash2, Truck, AlertCircle, RefreshCw, Phone, Mail, MapPin } from 'lucide-react';

const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await supplierApi.getAll();
      setSuppliers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
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
      if (editingSupplier) {
        await supplierApi.update(editingSupplier.id, formData);
        setSuccess(`Supplier '${formData.name}' updated successfully!`);
      } else {
        await supplierApi.create(formData);
        setSuccess(`Supplier '${formData.name}' created successfully!`);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving supplier.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete supplier '${name}'?`)) return;
    try {
      await supplierApi.delete(id);
      setSuccess(`Supplier '${name}' deleted successfully.`);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete supplier.');
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={28} color="var(--primary-accent)" />
            Pharmaceutical Suppliers
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage authorized drug manufacturers, distributors, and batch vendors.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchSuppliers} className="btn btn-secondary" title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add Supplier
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading suppliers list...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Supplier Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact Person</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact Info</th>
                <th style={{ padding: '0.75rem 1rem' }}>Address</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No suppliers found. Click "Add Supplier" to record a vendor.
                  </td>
                </tr>
              ) : (
                suppliers.map((sup) => (
                  <tr key={sup.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {sup.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {sup.contactPerson || 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {sup.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                          <Phone size={12} color="var(--primary-accent)" /> {sup.phone}
                        </div>
                      )}
                      {sup.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={12} color="var(--primary-accent)" /> {sup.email}
                        </div>
                      )}
                      {!sup.phone && !sup.email && 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {sup.address ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={12} /> {sup.address}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(sup)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', marginRight: '0.5rem' }}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(sup.id, sup.name)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '2rem', margin: '1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Supplier/Vendor Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pfizer Pharma Ltd, Sun Pharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Manager / Sales Rep Name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sales@vendor.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="City, State, Country"
                />
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
                  {submitting ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagementPage;
