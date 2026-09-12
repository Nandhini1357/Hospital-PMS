import React, { useState, useEffect } from 'react';
import patientApi from '../api/patientApi';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Search, Edit2, Trash2, History, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const PatientManagementPage = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'MALE',
    contactNumber: '',
    address: '',
    allergies: '',
    medicalHistory: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPatients = async (query = '') => {
    setLoading(true);
    try {
      const res = await patientApi.getAll(query);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(searchQuery);
  };

  const handleOpenAddModal = () => {
    setSelectedPatient(null);
    setFormData({
      fullName: '',
      age: '',
      gender: 'MALE',
      contactNumber: '',
      address: '',
      allergies: '',
      medicalHistory: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      fullName: patient.fullName || '',
      age: patient.age || '',
      gender: patient.gender || 'MALE',
      contactNumber: patient.contactNumber || '',
      address: patient.address || '',
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenHistoryModal = async (patient) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await patientApi.getHistory(patient.id);
      setHistoryList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedPatient) {
        await patientApi.update(selectedPatient.id, formData);
        setSuccess('Patient profile updated successfully!');
      } else {
        await patientApi.create(formData);
        setSuccess('New patient registered successfully!');
      }
      setShowModal(false);
      fetchPatients(searchQuery);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save patient record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await patientApi.delete(id);
      setSuccess('Patient deleted successfully');
      fetchPatients(searchQuery);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete patient');
    }
  };

  return (
    <div className="main-content">
      <div className="page-header flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Patient Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Register patients, view medical profiles, and check prescription histories.</p>
        </div>
        <button className="btn btn-primary flex items-center" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} />
          <span>Add Patient</span>
        </button>
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

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-container" style={{ maxWidth: '650px' }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search patients by name, patient ID (PAT-XXXXX), or contact number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>
        <button type="submit" className="btn btn-secondary">Search</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setSearchQuery(''); fetchPatients(''); }}>
          <RefreshCw size={16} />
        </button>
      </form>

      {/* Patients Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading patients...</div>
        ) : patients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No patients found. Click 'Add Patient' to register a new record.</div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Patient ID</th>
                <th style={{ padding: '0.75rem' }}>Full Name</th>
                <th style={{ padding: '0.75rem' }}>Age / Gender</th>
                <th style={{ padding: '0.75rem' }}>Contact Number</th>
                <th style={{ padding: '0.75rem' }}>Allergies</th>
                <th style={{ padding: '0.75rem' }}>Medical History</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>{p.patientNumber}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{p.fullName}</td>
                  <td style={{ padding: '0.75rem' }}>{p.age} yrs / {p.gender}</td>
                  <td style={{ padding: '0.75rem' }}>{p.contactNumber}</td>
                  <td style={{ padding: '0.75rem', color: p.allergies ? '#f59e0b' : 'var(--text-secondary)' }}>{p.allergies || 'None'}</td>
                  <td style={{ padding: '0.75rem' }}>{p.medicalHistory || 'None'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" title="View Medication History" onClick={() => handleOpenHistoryModal(p)} style={{ padding: '0.35rem 0.6rem' }}>
                        <History size={15} />
                      </button>
                      <button className="btn btn-secondary" title="Edit Patient" onClick={() => handleOpenEditModal(p)} style={{ padding: '0.35rem 0.6rem' }}>
                        <Edit2 size={15} />
                      </button>
                      {user?.role === 'ADMIN' && (
                        <button className="btn btn-secondary" title="Delete Patient" onClick={() => handleDelete(p.id)} style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Patient Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{selectedPatient ? 'Edit Patient Profile' : 'Register New Patient'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Gender *</label>
                  <select
                    className="form-control"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Contact Number *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Allergies (if any)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Medical History</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Diabetes, Hypertension"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{selectedPatient ? 'Update Patient' : 'Register Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistoryModal && selectedPatient && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Medication History</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Patient: <strong style={{ color: 'var(--primary-accent)' }}>{selectedPatient.fullName}</strong> ({selectedPatient.patientNumber})
                </p>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Close</button>
            </div>

            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading medication history...</div>
            ) : historyList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No prior medication dispensing history recorded for this patient.</div>
            ) : (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Date</th>
                    <th style={{ padding: '0.6rem' }}>Drug Name</th>
                    <th style={{ padding: '0.6rem' }}>Dosage & Freq</th>
                    <th style={{ padding: '0.6rem' }}>Qty Dispensed</th>
                    <th style={{ padding: '0.6rem' }}>Pharmacist</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem' }}>{new Date(h.dispensedDate).toLocaleDateString()}</td>
                      <td style={{ padding: '0.6rem', fontWeight: '500' }}>{h.drugName} ({h.drugCode})</td>
                      <td style={{ padding: '0.6rem' }}>{h.dosage} - {h.frequency}</td>
                      <td style={{ padding: '0.6rem', fontWeight: 'bold' }}>{h.quantityDispensed}</td>
                      <td style={{ padding: '0.6rem' }}>{h.pharmacistName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagementPage;
