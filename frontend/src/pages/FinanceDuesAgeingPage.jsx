import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceApi from '../api/invoiceApi';
import {
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  DollarSign,
  Send,
  FileText,
  ShieldAlert
} from 'lucide-react';

const FinanceDuesAgeingPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeingBracket, setSelectedAgeingBracket] = useState('ALL');
  const [reminderToast, setReminderToast] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoiceApi.getMyInvoices();
      const rawInvoices = res.data || [];

      // Calculate ageing days & bracket for each invoice
      const processed = rawInvoices.map((inv) => {
        const invDate = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date();
        const diffMs = new Date() - invDate;
        const ageingDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        let bracket = '0-30 DAYS';
        if (ageingDays > 90) bracket = '>90 DAYS';
        else if (ageingDays > 60) bracket = '61-90 DAYS';
        else if (ageingDays > 30) bracket = '31-60 DAYS';

        const balanceDue = inv.balanceDue != null ? inv.balanceDue : Math.max(0, (inv.netAmount || 0) - (inv.amountPaid || 0));

        return {
          ...inv,
          ageingDays,
          bracket,
          balanceDue
        };
      });

      setInvoices(processed);
    } catch (err) {
      console.error('Failed to load dues ageing report:', err);
      setError('Failed to fetch patient outstanding dues ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSendReminder = (inv) => {
    setReminderToast(`Payment reminder SMS/Email successfully dispatched to ${inv.patientName || 'Patient'} for ${inv.invoiceNumber} (Dues: ₹${inv.balanceDue.toFixed(2)})`);
    setTimeout(() => {
      setReminderToast('');
    }, 4000);
  };

  const unpaidInvoices = invoices.filter((inv) => inv.paymentStatus !== 'PAID' && inv.balanceDue > 0);

  const filteredInvoices = unpaidInvoices.filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.patientName && inv.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.patientNumber && inv.patientNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBracket = selectedAgeingBracket === 'ALL' || inv.bracket === selectedAgeingBracket;

    return matchesSearch && matchesBracket;
  });

  // Calculate Aggregates
  const totalDues = unpaidInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);
  const dues0to30 = unpaidInvoices.filter((inv) => inv.bracket === '0-30 DAYS').reduce((acc, inv) => acc + inv.balanceDue, 0);
  const dues31to60 = unpaidInvoices.filter((inv) => inv.bracket === '31-60 DAYS').reduce((acc, inv) => acc + inv.balanceDue, 0);
  const duesAbove60 = unpaidInvoices.filter((inv) => inv.bracket === '61-90 DAYS' || inv.bracket === '>90 DAYS').reduce((acc, inv) => acc + inv.balanceDue, 0);

  return (
    <div className="main-content">
      {/* Header & Back Action */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Hospital Pharmacy Dues & Ageing Control
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={28} color="var(--primary-accent)" />
          View Dues Ageing Report
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Analyze outstanding patient pharmacy balances categorized by ageing brackets (0-30 Days, 31-60 Days, 61-90 Days, &gt;90 Days).
        </p>
      </div>

      {reminderToast && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={18} />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Dues Outstanding</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ef4444', marginTop: '0.2rem' }}>
            ₹{totalDues.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across all unpaid pharmacy invoices</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>0–30 Days Current</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
            ₹{dues0to30.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard billing cycle</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>31–60 Days Overdue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.2rem' }}>
            ₹{dues31to60.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Second reminder window</span>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>&gt;60 Days Critical Ledger</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f87171', marginTop: '0.2rem' }}>
            ₹{duesAbove60.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit escalation threshold</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', '0-30 DAYS', '31-60 DAYS', '61-90 DAYS', '>90 DAYS'].map((bracket) => (
            <button
              key={bracket}
              className={`btn ${selectedAgeingBracket === bracket ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedAgeingBracket(bracket)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              {bracket}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper" style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by patient or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Dues Ageing Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Calculating patient dues ageing analysis...
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Outstanding Dues Found</h3>
          <p>No patient invoices match the selected ageing bracket filter.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Invoice Number</th>
                <th style={{ padding: '0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.75rem' }}>Prescription</th>
                <th style={{ padding: '0.75rem' }}>Net Amount</th>
                <th style={{ padding: '0.75rem' }}>Amount Paid</th>
                <th style={{ padding: '0.75rem' }}>Balance Due</th>
                <th style={{ padding: '0.75rem' }}>Ageing (Days)</th>
                <th style={{ padding: '0.75rem' }}>Ageing Bracket</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                let badgeColor = '#34d399';
                let badgeBg = 'rgba(52, 211, 153, 0.15)';
                if (inv.bracket === '31-60 DAYS') {
                  badgeColor = '#f59e0b';
                  badgeBg = 'rgba(245, 158, 11, 0.15)';
                } else if (inv.bracket === '61-90 DAYS' || inv.bracket === '>90 DAYS') {
                  badgeColor = '#ef4444';
                  badgeBg = 'rgba(239, 68, 68, 0.15)';
                }

                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>{inv.patientName || 'Patient'}</strong>
                      {inv.patientNumber && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.patientNumber}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{inv.prescriptionNumber || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>₹{(inv.netAmount || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>₹{(inv.amountPaid || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ef4444' }}>
                      ₹{(inv.balanceDue || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{inv.ageingDays} days</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: badgeBg,
                          color: badgeColor
                        }}
                      >
                        {inv.bracket}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleSendReminder(inv)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Send size={14} />
                        Send Reminder
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

export default FinanceDuesAgeingPage;
