import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { UserPlus, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'PHARMACIST',
    licenceNumber: '',
    employeeId: '',
    mobile: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ checking: false, exists: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Debounced Email Check
  useEffect(() => {
    if (!formData.email || !formData.email.includes('@')) return;

    const timer = setTimeout(async () => {
      setEmailStatus({ checking: true, exists: false });
      try {
        const res = await api.get(`/api/auth/check-email?email=${encodeURIComponent(formData.email)}`);
        setEmailStatus({ checking: false, exists: res.data.exists });
      } catch (e) {
        setEmailStatus({ checking: false, exists: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client Validation 1: Alphabetic Name
    if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      setError("Drug name must not contain special characters or numbers");
      return;
    }

    // Client Validation 2: 10-digit Phone
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError("Phone Number must be exactly 10 digits long");
      return;
    }

    if (emailStatus.exists) {
      setError("Email address is already registered.");
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', formData);
      setSuccess("Registration successful! Please verify your email.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (!err.response) {
        setError("Unable to connect to the backend server. Please make sure the Spring Boot server is running on port 8080.");
      } else {
        setError("Registration failed. Please check form inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>User Registration</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Establish trusted access for pharmacy management operations
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name (Alphabetic only)</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="john.doe@pharmacy.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailStatus.checking && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Checking email availability...</span>}
            {emailStatus.exists && <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)' }}>This email is already registered.</span>}
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0' }}>
            <div className="form-group">
              <label className="form-label">Phone Number (10 digits)</label>
              <input
                type="text"
                name="mobile"
                className="form-input"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">User Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="DOCTOR">Doctor</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="FINANCE">Finance Officer</option>
                <option value="ADMIN">System Administrator</option>
                <option value="PATIENT">Patient</option>
              </select>
            </div>
          </div>

          {/* Domain Specific Fields */}
          {formData.role === 'PHARMACIST' && (
            <div className="form-group">
              <label className="form-label">Pharmacy Council Registration Number</label>
              <input
                type="text"
                name="licenceNumber"
                className="form-input"
                placeholder="e.g. PCRN-998877"
                value={formData.licenceNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {(formData.role === 'DOCTOR' || formData.role === 'STORE_MANAGER' || formData.role === 'FINANCE' || formData.role === 'ADMIN') && (
            <div className="form-group">
              <label className="form-label">Employee / Staff ID</label>
              <input
                type="text"
                name="employeeId"
                className="form-input"
                placeholder="e.g. EMP-2024"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password (Min 8 chars)</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={loading || emailStatus.exists}
          >
            {loading ? 'Processing Registration...' : (
              <>
                <UserPlus size={18} /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--primary-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
