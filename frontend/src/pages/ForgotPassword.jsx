import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { KeyRound, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || "OTP sent to your email with 15-minute validity window.");
      setStep(2);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to request password reset OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/reset-password', {
        email,
        otpCode,
        newPassword
      });
      setMessage(res.data.message || "Password reset successful. You can now login.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please check OTP code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Account Recovery</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Time-limited email OTP with 15-minute validity window
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Registered Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@pharmacy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Sending OTP...' : (
                <>
                  <KeyRound size={18} /> Request Recovery OTP
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">6-Digit OTP Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (Min 8 chars)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
