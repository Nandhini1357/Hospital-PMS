import React, { useState, useEffect } from 'react';
import categoryApi from '../api/categoryApi';
import { Plus, Edit2, Trash2, Tag, AlertCircle, RefreshCw } from 'lucide-react';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch drug categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
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
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
        setSuccess(`Category '${formData.name}' updated successfully!`);
      } else {
        await categoryApi.create(formData);
        setSuccess(`Category '${formData.name}' created successfully!`);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category '${name}'?`)) return;
    try {
      await categoryApi.delete(id);
      setSuccess(`Category '${name}' deleted successfully.`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={28} color="var(--primary-accent)" />
            Drug Categories
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage drug classification categories for inventory categorization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchCategories} className="btn btn-secondary" title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add Category
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading drug categories...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem' }}>Created At</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No drug categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>#{cat.id}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--primary-accent)' }}>
                      {cat.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {cat.description || 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', marginRight: '0.5rem' }}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Add / Edit Category Modal */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', margin: '1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Antibiotics, Analgesics"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '90px', resize: 'vertical' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief explanation of this drug category..."
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
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;
