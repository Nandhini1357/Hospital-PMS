import React, { useState } from 'react';
import NarcoticsRegisterView from '../components/NarcoticsRegisterView';
import CDSCOReportGenerator from '../components/CDSCOReportGenerator';
import NarcoticsReconciliationPanel from '../components/NarcoticsReconciliationPanel';
import { Lock, FileText, Scale, PackagePlus, Trash2 } from 'lucide-react';
import { recordNarcoticsReceipt, recordNarcoticsDestruction } from '../api/narcoticsApi';

const NarcoticsManagementPage = () => {
  const [activeTab, setActiveTab] = useState('register'); // register, reconcile, report, receipt, destruction

  // Receipt Form State
  const [receiptDrugId, setReceiptDrugId] = useState('');
  const [receiptBatchNo, setReceiptBatchNo] = useState('');
  const [receiptQty, setReceiptQty] = useState('');
  const [receiptManufacturer, setReceiptManufacturer] = useState('');
  const [receiptInvoice, setReceiptInvoice] = useState('');
  const [receiptPrimaryId, setReceiptPrimaryId] = useState('');
  const [receiptMsg, setReceiptMsg] = useState(null);

  // Destruction Form State
  const [destDrugId, setDestDrugId] = useState('');
  const [destBatchNo, setDestBatchNo] = useState('');
  const [destQty, setDestQty] = useState('');
  const [destWitness, setDestWitness] = useState('');
  const [destMethod, setDestMethod] = useState('');
  const [destPrimaryId, setDestPrimaryId] = useState('');
  const [destMsg, setDestMsg] = useState(null);

  const handleRecordReceipt = async (e) => {
    e.preventDefault();
    setReceiptMsg(null);
    try {
      const payload = {
        drugId: Number(receiptDrugId),
        batchNo: receiptBatchNo,
        quantity: Number(receiptQty),
        manufacturer: receiptManufacturer,
        supplierInvoice: receiptInvoice,
        primaryPharmacistId: Number(receiptPrimaryId),
        primaryDigitalSig: `DSIG-REC-${receiptPrimaryId}-${Date.now()}`
      };
      const res = await recordNarcoticsReceipt(payload);
      setReceiptMsg({ type: 'success', text: `Narcotics stock receipt recorded successfully (Entry #${res.id}).` });
      setReceiptDrugId('');
      setReceiptBatchNo('');
      setReceiptQty('');
    } catch (err) {
      setReceiptMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to record stock receipt.' });
    }
  };

  const handleRecordDestruction = async (e) => {
    e.preventDefault();
    setDestMsg(null);
    try {
      const payload = {
        drugId: Number(destDrugId),
        batchNo: destBatchNo,
        quantity: Number(destQty),
        witnessName: destWitness,
        destructionMethod: destMethod,
        primaryPharmacistId: Number(destPrimaryId),
        primaryDigitalSig: `DSIG-DEST-${destPrimaryId}-${Date.now()}`
      };
      const res = await recordNarcoticsDestruction(payload);
      setDestMsg({ type: 'success', text: `Narcotics destruction recorded successfully (Entry #${res.id}).` });
      setDestDrugId('');
      setDestBatchNo('');
      setDestQty('');
    } catch (err) {
      setDestMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to record narcotics destruction.' });
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, fontSize: '1.8rem' }}>
          <Lock color="var(--primary-accent)" size={28} /> Narcotics & Controlled Substance Management Register
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>
          Phase 4 statutory controlled substance ledger, dual-pharmacist authorization, stock reconciliation, and CDSCO compliance reports.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button
          className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('register')}
          style={{ borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Lock size={16} /> Statutory Register Ledger
        </button>
        <button
          className={`btn ${activeTab === 'reconcile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('reconcile')}
          style={{ borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Scale size={16} /> Shift Reconciliation
        </button>
        <button
          className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('report')}
          style={{ borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <FileText size={16} /> CDSCO Compliance Report
        </button>
        <button
          className={`btn ${activeTab === 'receipt' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('receipt')}
          style={{ borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PackagePlus size={16} /> Record Stock Receipt
        </button>
        <button
          className={`btn ${activeTab === 'destruction' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('destruction')}
          style={{ borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Trash2 size={16} /> Record Destruction
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'register' && <NarcoticsRegisterView />}
      {activeTab === 'reconcile' && <NarcoticsReconciliationPanel />}
      {activeTab === 'report' && <CDSCOReportGenerator />}

      {activeTab === 'receipt' && (
        <div className="card" style={{ maxWidth: '600px', margin: '1rem auto' }}>
          <h3>Record Narcotics Stock Receipt</h3>
          {receiptMsg && <div className={`alert alert-${receiptMsg.type}`}>{receiptMsg.text}</div>}
          <form onSubmit={handleRecordReceipt}>
            <div className="form-group">
              <label>Drug ID *</label>
              <input type="number" className="form-control" value={receiptDrugId} onChange={(e) => setReceiptDrugId(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Batch Number *</label>
              <input type="text" className="form-control" value={receiptBatchNo} onChange={(e) => setReceiptBatchNo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" className="form-control" value={receiptQty} onChange={(e) => setReceiptQty(e.target.value)} min={1} required />
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input type="text" className="form-control" value={receiptManufacturer} onChange={(e) => setReceiptManufacturer(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Supplier Invoice Number</label>
              <input type="text" className="form-control" value={receiptInvoice} onChange={(e) => setReceiptInvoice(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Receiving Pharmacist User ID *</label>
              <input type="number" className="form-control" value={receiptPrimaryId} onChange={(e) => setReceiptPrimaryId(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Submit Receipt Entry
            </button>
          </form>
        </div>
      )}

      {activeTab === 'destruction' && (
        <div className="card" style={{ maxWidth: '600px', margin: '1rem auto' }}>
          <h3>Record Narcotics Destruction Entry</h3>
          {destMsg && <div className={`alert alert-${destMsg.type}`}>{destMsg.text}</div>}
          <form onSubmit={handleRecordDestruction}>
            <div className="form-group">
              <label>Drug ID *</label>
              <input type="number" className="form-control" value={destDrugId} onChange={(e) => setDestDrugId(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Batch Number *</label>
              <input type="text" className="form-control" value={destBatchNo} onChange={(e) => setDestBatchNo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity to Destroy *</label>
              <input type="number" className="form-control" value={destQty} onChange={(e) => setDestQty(e.target.value)} min={1} required />
            </div>
            <div className="form-group">
              <label>Witness Full Name *</label>
              <input type="text" className="form-control" placeholder="e.g. Dr. Chief Inspector / Senior Pharmacist" value={destWitness} onChange={(e) => setDestWitness(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Destruction Method *</label>
              <input type="text" className="form-control" placeholder="e.g. Chemical neutralization / Incineration" value={destMethod} onChange={(e) => setDestMethod(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Authorizing Pharmacist User ID *</label>
              <input type="number" className="form-control" value={destPrimaryId} onChange={(e) => setDestPrimaryId(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#EF4444' }}>
              Submit Destruction Entry
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NarcoticsManagementPage;
