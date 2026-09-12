import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import prescriptionApi from '../api/prescriptionApi';
import invoiceApi from '../api/invoiceApi';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  CreditCard,
  QrCode,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

const CounterCollectionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eligibleItems, setEligibleItems] = useState([]);
  const [selectedRxId, setSelectedRxId] = useState('');
  const [selectedCounter, setSelectedCounter] = useState('Counter #1');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');
  const [scheduledPass, setScheduledPass] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const availableSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [rxRes, invRes] = await Promise.all([
        prescriptionApi.getAll(),
        invoiceApi.getMyInvoices()
      ]);

      const rxList = rxRes.data || [];
      const invList = invRes.data || [];

      // Map prescriptions with their invoice payment status
      const mapped = rxList.map((rx) => {
        const matchingInvoice = invList.find(
          (inv) =>
            inv.prescriptionId === rx.id ||
            inv.prescriptionNumber === rx.prescriptionNumber
        );

        const isDispensed = rx.status === 'DISPENSED';
        const isPaid = matchingInvoice ? matchingInvoice.paymentStatus === 'PAID' : false;

        return {
          rx,
          invoice: matchingInvoice,
          isDispensed,
          isPaid,
          isEligible: isDispensed && isPaid
        };
      });

      setEligibleItems(mapped);

      // Auto-select first eligible prescription
      const firstEligible = mapped.find((m) => m.isEligible);
      if (firstEligible) {
        setSelectedRxId(firstEligible.rx.id.toString());
      } else if (mapped.length > 0) {
        setSelectedRxId(mapped[0].rx.id.toString());
      }
    } catch (err) {
      console.error('Failed to load collection eligibility data:', err);
      setError('Failed to fetch your prescription and invoice details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const item = eligibleItems.find((m) => m.rx.id.toString() === selectedRxId);
    if (!item) {
      setError('Please select a valid prescription.');
      return;
    }

    if (!item.isEligible) {
      setError('This prescription is not eligible for counter collection. It must be DISPENSED and its invoice PAID.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Generate collection pass reference
    const passRef = `COL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      const newPass = {
        passRef,
        rxNumber: item.rx.prescriptionNumber,
        invoiceNumber: item.invoice ? item.invoice.invoiceNumber : 'N/A',
        patientName: item.rx.patientName || 'Valued Patient',
        counter: selectedCounter,
        scheduledDate: selectedDate,
        timeSlot: selectedSlot,
        medicines: item.rx.items || [],
        createdAt: new Date().toISOString()
      };

      setScheduledPass(newPass);
      setSubmitting(false);
    }, 600);
  };

  const selectedItem = eligibleItems.find((m) => m.rx.id.toString() === selectedRxId);

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
          Pharmacy Counter Express Pickup Service
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Schedule Counter Collection</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose a pharmacy counter and collection time for your dispensed prescription.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Loading eligible prescriptions and payment records...
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#f87171' }}>
          <AlertTriangle size={36} color="#f87171" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-secondary" onClick={fetchData} style={{ marginTop: '1rem' }}>
            Retry Loading
          </button>
        </div>
      ) : eligibleItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Prescriptions Available</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            You do not currently have any active prescriptions linked to your patient account.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: scheduledPass ? '1fr' : '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left / Top Panel: Prescription & Invoice Selector */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PackageCheck size={20} color="var(--primary-accent)" />
              1. Select Prescribed Medication
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Your Prescriptions & Billing Status:
              </label>
              <select
                className="form-control"
                value={selectedRxId}
                onChange={(e) => {
                  setSelectedRxId(e.target.value);
                  setScheduledPass(null);
                }}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                {eligibleItems.map((item) => (
                  <option key={item.rx.id} value={item.rx.id}>
                    {item.rx.prescriptionNumber} — Status: {item.rx.status} | Invoice: {item.invoice ? item.invoice.paymentStatus : 'UNPAID'} {item.isEligible ? '(Eligible)' : '(Ineligible)'}
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                    Prescription #{selectedItem.rx.prescriptionNumber}
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: selectedItem.isDispensed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: selectedItem.isDispensed ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {selectedItem.rx.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Doctor:</span>
                    <strong>{selectedItem.rx.doctorName || 'Hospital Staff Doctor'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Invoice Payment:</span>
                    <strong style={{ color: selectedItem.isPaid ? '#10b981' : '#ef4444' }}>
                      {selectedItem.invoice ? `${selectedItem.invoice.invoiceNumber} (${selectedItem.invoice.paymentStatus})` : 'No Invoice / Unpaid'}
                    </strong>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Prescribed Medicines:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  {selectedItem.rx.items && selectedItem.rx.items.length > 0 ? (
                    selectedItem.rx.items.map((med, idx) => (
                      <li key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{med.drugName}</strong> ({med.dosage})</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Qty: {med.quantity} | {med.frequency}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Medications listed in prescription file</li>
                  )}
                </ul>

                {!selectedItem.isEligible && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} />
                    <span>
                      {!selectedItem.isDispensed
                        ? 'Prescription must be verified and DISPENSED by pharmacist before scheduling collection.'
                        : 'Invoice must be PAID online before counter collection slot can be booked.'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Slot Picker & Form or Confirmation Banner */}
          {!scheduledPass ? (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="var(--primary-accent)" />
                2. Choose Counter & Slot
              </h2>

              <form onSubmit={handleScheduleSubmit}>
                {/* Counter Choice */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Pharmacy Collection Counter:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {['Counter #1', 'Counter #2'].map((cntr) => (
                      <button
                        type="button"
                        key={cntr}
                        className={`btn ${selectedCounter === cntr ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCounter(cntr)}
                        style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
                      >
                        <MapPin size={16} />
                        {cntr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collection Date */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Preferred Pickup Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '0.65rem' }}
                    required
                  />
                </div>

                {/* Available Time Slots */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Select Time Window:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        className={`btn ${selectedSlot === slot ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedSlot(slot)}
                        style={{ textAlign: 'left', padding: '0.6rem 1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <span>{slot}</span>
                        {selectedSlot === slot && <CheckCircle2 size={16} color="#34d399" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedItem?.isEligible || submitting}
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  {submitting ? 'Booking Slot...' : 'Schedule Collection'}
                </button>
              </form>
            </div>
          ) : (
            /* Confirmation Card / Collection Pass Display */
            <div className="glass-panel" style={{ padding: '2rem', borderColor: '#34d399', background: 'rgba(16, 185, 129, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <CheckCircle2 size={36} color="#34d399" />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399' }}>Collection Scheduled Successfully!</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Present this digital pass at the pharmacy counter for instant pickup.</p>
                </div>
              </div>

              {/* Digital Pickup Pass Card */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', border: '1px dashed var(--success-color)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      COUNTER PICKUP VOUCHER
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>Ref: {scheduledPass.passRef}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <QrCode size={42} color="var(--success-color)" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Prescription Number:</span>
                    <strong style={{ color: 'var(--primary-accent)' }}>{scheduledPass.rxNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Invoice Reference:</span>
                    <strong style={{ color: 'var(--success-color)' }}>{scheduledPass.invoiceNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Assigned Counter:</span>
                    <strong style={{ color: 'var(--warning-color)' }}>{scheduledPass.counter}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Date & Time Slot:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{scheduledPass.scheduledDate} ({scheduledPass.timeSlot})</strong>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} color="#34d399" style={{ display: 'inline', marginRight: '0.4rem' }} />
                  Verification QR Pass verified against patient profile. Show this pass or quote <strong>{scheduledPass.passRef}</strong> at {scheduledPass.counter}.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setScheduledPass(null)}
                  style={{ flex: 1 }}
                >
                  Schedule Another Collection
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/prescriptions')}
                  style={{ flex: 1 }}
                >
                  View My Prescriptions
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CounterCollectionPage;
