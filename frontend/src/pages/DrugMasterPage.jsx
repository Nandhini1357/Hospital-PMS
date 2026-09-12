import React, { useState, useEffect } from 'react';
import drugApi from '../api/drugApi';
import categoryApi from '../api/categoryApi';
import { Plus, Edit2, Trash2, Search, Filter, Pill, AlertTriangle, RefreshCw } from 'lucide-react';

const DrugMasterPage = () => {
  const [drugs, setDrugs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    code: '',
    categoryId: '',
    unit: 'Tablet',
    reorderLevel: 10,
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showQuickCat, setShowQuickCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [creatingQuickCat, setCreatingQuickCat] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [drugsRes, catRes] = await Promise.all([
        drugApi.getAll(),
        categoryApi.getAll(),
      ]);
      setDrugs(drugsRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drug master catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const catId = selectedCategory ? Number(selectedCategory) : null;
      const res = await drugApi.search(searchQuery, catId);
      setDrugs(res.data || []);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = async () => {
    setEditingDrug(null);
    let currentCats = categories;
    try {
      const catRes = await categoryApi.getAll();
      currentCats = catRes.data || [];
      setCategories(currentCats);
    } catch (e) {
      // Use existing categories state fallback
    }

    setFormData({
      name: '',
      genericName: '',
      code: '',
      categoryId: currentCats.length > 0 ? String(currentCats[0].id) : '',
      unit: 'Tablet',
      reorderLevel: 10,
      description: '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCreateQuickCat = async (e) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    setCreatingQuickCat(true);
    try {
      const res = await categoryApi.create({ name: quickCatName.trim(), description: 'Quick added category' });
      const createdCat = res.data;
      const catRes = await categoryApi.getAll();
      const updatedCats = catRes.data || [];
      setCategories(updatedCats);
      setFormData((prev) => ({ ...prev, categoryId: String(createdCat.id) }));
      setQuickCatName('');
      setShowQuickCat(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setCreatingQuickCat(false);
    }
  };

  const handleOpenEdit = (drug) => {
    setEditingDrug(drug);
    setFormData({
      name: drug.name,
      genericName: drug.genericName || '',
      code: drug.code,
      categoryId: drug.categoryId,
      unit: drug.unit,
      reorderLevel: drug.reorderLevel,
      description: drug.description || '',
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
      if (editingDrug) {
        await drugApi.update(editingDrug.id, formData);
        setSuccess(`Drug '${formData.name}' updated successfully!`);
      } else {
        await drugApi.create(formData);
        setSuccess(`Drug '${formData.name}' created successfully!`);
      }
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving drug record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete drug '${name}' from catalog?`)) return;
    try {
      await drugApi.delete(id);
      setSuccess(`Drug '${name}' deleted successfully.`);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete drug.');
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pill size={28} color="var(--primary-accent)" />
            Drug Master Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Central repository of all registered medications and formulations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchInitialData} className="btn btn-secondary" title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add New Drug
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {success && <div className="alert alert-success">{success}</div>}

      {/* Search & Category Filter Toolbar */}
      <div className="glass-panel search-toolbar" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', maxWidth: '650px' }}>
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by drug name, generic name, or SKU code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search size={18} className="search-icon" color="var(--text-muted)" />
        </div>

        <div style={{ width: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSearch} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
          Search
        </button>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading catalog...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Code / SKU</th>
                <th style={{ padding: '0.75rem 1rem' }}>Drug Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Generic Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Unit</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Stock</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reorder Level</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drugs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No drugs found in catalog matching your criteria.
                  </td>
                </tr>
              ) : (
                drugs.map((drug) => {
                  const isLow = (drug.totalStock || 0) <= drug.reorderLevel;
                  return (
                    <tr key={drug.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--primary-accent)', fontWeight: 600 }}>
                        {drug.code}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {drug.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {drug.genericName || 'N/A'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '4px', fontSize: '0.8rem', color: '#a5b4fc' }}>
                          {drug.categoryName}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {drug.unit}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            backgroundColor: isLow ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: isLow ? '#f87171' : '#34d399',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {isLow && <AlertTriangle size={12} />}
                          {drug.totalStock || 0}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                        {drug.reorderLevel}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenEdit(drug)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', marginRight: '0.5rem' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(drug.id, drug.name)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Delete"
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

      {/* Add / Edit Modal */}
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
            <h2 style={{ marginBottom: '1.25rem' }}>{editingDrug ? 'Edit Drug' : 'Add New Drug'}</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Drug Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Paracetamol 500mg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Drug Code / SKU *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. DRUG-PARA-500"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Generic Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Acetaminophen"
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowQuickCat(!showQuickCat)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {showQuickCat ? 'Cancel' : '+ Quick Add Category'}
                    </button>
                  </div>

                  {showQuickCat ? (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="New category name..."
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateQuickCat}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        disabled={creatingQuickCat || !quickCatName.trim()}
                      >
                        {creatingQuickCat ? 'Saving...' : 'Save Cat'}
                      </button>
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      {categories.length === 0 ? (
                        <option value="">No categories found. Click "+ Quick Add Category" above.</option>
                      ) : (
                        <>
                          <option value="">-- Select Category --</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Unit of Dosage *</label>
                  <select
                    className="form-select"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Vial">Vial</option>
                    <option value="Ampoule">Ampoule</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reorder Level Threshold *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Storage requirements, dosage guidelines..."
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
                  {submitting ? 'Saving...' : editingDrug ? 'Update Drug' : 'Create Drug'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugMasterPage;
