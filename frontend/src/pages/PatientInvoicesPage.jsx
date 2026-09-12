import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceApi from '../api/invoiceApi';
import { CreditCard, CheckCircle, AlertTriangle, ShieldCheck, Clock, FileText, ArrowLeft, X, Smartphone, Building } from 'lucide-react';

const PatientInvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_UPI');
  const [paying, setPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoiceApi.getMyInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to load invoices", err);
      setError("Failed to load your pharmacy invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenPayModal = (inv) => {
    setSelectedInvoice(inv);
    setPaymentMethod('ONLINE_UPI');
    setSuccessMessage('');
  };

  const handleClosePayModal = () => {
    setSelectedInvoice(null);
    setSuccessMessage('');
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setPaying(true);
    setError('');
    try {
      const payload = {
        invoiceId: selectedInvoice.id,
        amount: selectedInvoice.balanceDue,
        paymentMethod: paymentMethod,
        notes: 'Patient online payment via patient portal demo gateway.'
      };

      const res = await invoiceApi.pay(selectedInvoice.id, payload);
      setSuccessMessage(`Payment Successful! Transaction Ref: ${res.data.transactionReference}`);
      await fetchInvoices();

      setTimeout(() => {
        handleClosePayModal();
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>PAID</span>;
      case 'PARTIALLY_PAID':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>PARTIALLY PAID</span>;
      case 'UNPAID':
      default:
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>UNPAID</span>;
    }
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>HPMS Online Billing & Payment Portal</span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Patient Invoices & Online Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View pharmacy invoices, review GST & TPA insurance coverage, and settle outstanding balances online.</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading pharmacy invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Invoices Found</h3>
          <p>You currently have no billing invoices or outstanding balances.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {invoices.map((inv) => (
            <div key={inv.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
                    Invoice #{inv.invoiceNumber}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Prescription Ref: <strong>{inv.prescriptionNumber}</strong> | Date: {new Date(inv.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  {getStatusBadge(inv.paymentStatus)}
                </div>
              </div>

              {/* Billing Itemized Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Pharmacy Subtotal</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>₹{inv.subtotal?.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>GST (18%)</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#60a5fa' }}>+ ₹{inv.gstAmount?.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>TPA Insurance Coverage</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#34d399' }}>- ₹{inv.insuranceCoverage?.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Net Bill Amount</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{inv.netAmount?.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Amount Paid</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#10b981' }}>₹{inv.amountPaid?.toFixed(2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Balance Due</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: inv.balanceDue > 0 ? '#ef4444' : '#10b981' }}>
                    ₹{inv.balanceDue?.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  {inv.paymentStatus === 'PAID' ? (
                    <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold' }}>
                      <CheckCircle size={16} />
                      Paid via {inv.paymentMethod} (Ref: {inv.transactionReference})
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Outstanding dues can be paid online via UPI, Credit/Debit Card, or NetBanking.
                    </span>
                  )}
                </div>

                {inv.balanceDue > 0 && (
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => handleOpenPayModal(inv)}
                  >
                    <CreditCard size={18} />
                    <span>Pay ₹{inv.balanceDue?.toFixed(2)} Online</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Online Payment Modal */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard color="var(--primary-accent)" size={22} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Online Payment Gateway (DEMO MODE)</h3>
              </div>
              <button onClick={handleClosePayModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {successMessage ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Completed!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleExecutePayment}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    <span>Invoice Ref:</span>
                    <strong>#{selectedInvoice.invoiceNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    <span>Prescription Ref:</span>
                    <strong>{selectedInvoice.prescriptionNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span>Total Payable Dues:</span>
                    <span style={{ color: 'var(--primary-accent)' }}>₹{selectedInvoice.balanceDue?.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Select Payment Method:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', background: paymentMethod === 'ONLINE_UPI' ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${paymentMethod === 'ONLINE_UPI' ? 'var(--primary-accent)' : 'var(--border-color)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="payMethod" value="ONLINE_UPI" checked={paymentMethod === 'ONLINE_UPI'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <Smartphone size={18} color="#60a5fa" />
                      <span style={{ fontSize: '0.85rem' }}>UPI / Google Pay / PhonePe / BHIM</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', background: paymentMethod === 'CARD' ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${paymentMethod === 'CARD' ? 'var(--primary-accent)' : 'var(--border-color)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="payMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <CreditCard size={18} color="#34d399" />
                      <span style={{ fontSize: '0.85rem' }}>Credit / Debit Card</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', background: paymentMethod === 'NET_BANKING' ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${paymentMethod === 'NET_BANKING' ? 'var(--primary-accent)' : 'var(--border-color)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="payMethod" value="NET_BANKING" checked={paymentMethod === 'NET_BANKING'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <Building size={18} color="#c084fc" />
                      <span style={{ fontSize: '0.85rem' }}>Net Banking (All Indian Banks)</span>
                    </label>
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', color: '#f59e0b', marginBottom: '1.25rem' }}>
                  <strong>DEMO PAYMENT NOTICE:</strong> This environment simulates an online payment gateway. No real money will be charged.
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleClosePayModal} disabled={paying}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={paying}>
                    {paying ? 'Processing Payment...' : `Confirm & Pay ₹${selectedInvoice.balanceDue?.toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInvoicesPage;
