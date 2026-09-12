import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientApi from '../api/patientApi';
import drugApi from '../api/drugApi';
import prescriptionApi from '../api/prescriptionApi';
import { Plus, Trash2, FileText, CheckCircle, AlertCircle, Search } from 'lucide-react';

const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [availableDrugs, setAvailableDrugs] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { drugId: '', dosage: '', frequency: '1-0-1', duration: '5 days', quantity: 10, instructions: 'Take after food' }
  ]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, drugsRes] = await Promise.all([
          patientApi.getAll(),
          drugApi.getAll()
        ]);
        setPatients(patientsRes.data);
        setAvailableDrugs(drugsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      { drugId: '', dosage: '', frequency: '1-0-1', duration: '5 days', quantity: 10, instructions: 'Take after food' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedPatientId) {
      setError('Please select a patient');
      return;
    }

    if (items.some(item => !item.drugId || !item.dosage || !item.quantity)) {
      setError('Please complete all drug selection fields for each line item.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientId: Number(selectedPatientId),
        notes,
        items: items.map(i => ({
          drugId: Number(i.drugId),
          dosage: i.dosage,
          frequency: i.frequency,
          duration: i.duration,
          quantity: Number(i.quantity),
          instructions: i.instructions
        }))
      };

      const res = await prescriptionApi.create(payload);
      setSuccess(`Prescription ${res.data.prescriptionNumber} created successfully!`);
      setTimeout(() => {
        navigate(`/prescriptions/${res.data.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '3rem' }}>Loading form...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Create Electronic Prescription</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Issue electronic prescriptions with multi-medicine dosing instructions for patients.</p>
      </div>

      {success && (
        <div className="alert alert-success" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Patient Selection Header */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Patient Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Select Patient *</label>
              <select
                className="form-control"
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.patientNumber}) - Age: {p.age}, Gender: {p.gender}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Diagnosis / Clinical Notes</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acute upper respiratory infection"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Prescribed Medicines</h2>
            <button type="button" className="btn btn-secondary" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} />
              <span>Add Medicine Line</span>
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-accent)' }}>Item #{idx + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => handleRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Drug / Medication *</label>
                  <select
                    className="form-control"
                    required
                    value={item.drugId}
                    onChange={(e) => handleItemChange(idx, 'drugId', e.target.value)}
                  >
                    <option value="">-- Select Drug --</option>
                    {availableDrugs.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code}) - Category: {d.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Dosage *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 500mg"
                    required
                    value={item.dosage}
                    onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Frequency *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1-0-1 or Twice daily"
                    required
                    value={item.frequency}
                    onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 5 days"
                    required
                    value={item.duration}
                    onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Special Instructions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Take after food with plenty of water"
                  value={item.instructions}
                  onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/prescriptions')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating Prescription...' : 'Issue Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePrescriptionPage;
