import React, { useState, useEffect } from 'react';
import { supplierApi, purchaseOrderApi, grnApi, qualityInspectionApi } from '../api/procurementApi';
import drugApi from '../api/drugApi';
import {
  Truck, ShoppingBag, ClipboardCheck, ShieldCheck, Plus, Search,
  RefreshCw, CheckCircle, AlertCircle, Eye, Edit2, Trash2, Send,
  XCircle, Zap, FileText, Check, AlertTriangle, ArrowRight
} from 'lucide-react';

const ProcurementPage = () => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data States
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [autoDrafts, setAutoDrafts] = useState([]);
  const [grns, setGrns] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [drugs, setDrugs] = useState([]);

  // Modal States
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '', gstin: '', isActive: true
  });

  const [showPOModal, setShowPOModal] = useState(false);
  const [poForm, setPoForm] = useState({
    supplierId: '', expectedDeliveryDate: '', notes: '', items: [{ drugId: '', quantity: 50, unitPrice: 45.00 }]
  });

  const [showPODetailsModal, setShowPODetailsModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const [showGRNModal, setShowGRNModal] = useState(false);
  const [grnForm, setGrnForm] = useState({
    purchaseOrderId: '', invoiceNumber: '', notes: '', items: []
  });

  const [showQCModal, setShowQCModal] = useState(false);
  const [selectedGrnForQC, setSelectedGrnForQC] = useState(null);
  const [qcForm, setQcForm] = useState({
    result: 'PASSED', remarks: '', itemInspections: []
  });

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [supRes, poRes, drugRes, grnRes, qcRes, autoDraftRes] = await Promise.all([
        supplierApi.getAll(),
        purchaseOrderApi.getAll(),
        drugApi.getAll(),
        grnApi.getAll(),
        qualityInspectionApi.getAll(),
        purchaseOrderApi.getAutoDraftSuggestions()
      ]);
      setSuppliers(supRes.data || []);
      setPurchaseOrders(poRes.data || []);
      setDrugs(drugRes.data || []);
      setGrns(grnRes.data || []);
      setInspections(qcRes.data || []);
      setAutoDrafts(autoDraftRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load procurement data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAutoDrafts = async () => {
    try {
      const res = await purchaseOrderApi.getAutoDraftSuggestions();
      setAutoDrafts(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------- SUPPLIER HANDLERS ----------------
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({ name: '', contactPerson: '', email: '', phone: '', address: '', gstin: '', isActive: true });
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (sup) => {
    setEditingSupplier(sup);
    setSupplierForm({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
      gstin: sup.gstin || '',
      isActive: sup.isActive !== false
    });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editingSupplier) {
        await supplierApi.update(editingSupplier.id, supplierForm);
        setSuccess(`Supplier '${supplierForm.name}' updated successfully!`);
      } else {
        await supplierApi.create(supplierForm);
        setSuccess(`Supplier '${supplierForm.name}' created successfully!`);
      }
      setShowSupplierModal(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier.');
    }
  };

  const handleToggleSupplierStatus = async (id, currentStatus, name) => {
    try {
      await supplierApi.toggleStatus(id, !currentStatus);
      setSuccess(`Supplier '${name}' ${!currentStatus ? 'activated' : 'deactivated'} successfully.`);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change supplier status.');
    }
  };

  // ---------------- PURCHASE ORDER HANDLERS ----------------
  const handleOpenCreatePO = () => {
    setPoForm({
      supplierId: suppliers.length > 0 ? suppliers[0].id : '',
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: '',
      items: [{ drugId: drugs.length > 0 ? drugs[0].id : '', quantity: 50, unitPrice: 45.00 }]
    });
    setShowPOModal(true);
  };

  const handleAddPOItemRow = () => {
    setPoForm({
      ...poForm,
      items: [...poForm.items, { drugId: drugs.length > 0 ? drugs[0].id : '', quantity: 50, unitPrice: 45.00 }]
    });
  };

  const handleRemovePOItemRow = (index) => {
    if (poForm.items.length === 1) return;
    const newItems = [...poForm.items];
    newItems.splice(index, 1);
    setPoForm({ ...poForm, items: newItems });
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        supplierId: parseInt(poForm.supplierId),
        expectedDeliveryDate: poForm.expectedDeliveryDate,
        notes: poForm.notes,
        status: 'DRAFT',
        items: poForm.items.map(i => ({
          drugId: parseInt(i.drugId),
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice)
        }))
      };
      await purchaseOrderApi.create(payload);
      setSuccess('Purchase Order Draft created successfully!');
      setShowPOModal(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Purchase Order.');
    }
  };

  const handleDraftFromSuggestion = (suggestion) => {
    setPoForm({
      supplierId: suggestion.suggestedSupplierId || (suppliers.length > 0 ? suppliers[0].id : ''),
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: `Auto-generated draft for reorder trigger (Current Stock: ${suggestion.currentStock}, Reorder Level: ${suggestion.reorderLevel})`,
      items: [{ drugId: suggestion.drugId, quantity: suggestion.suggestedReorderQuantity, unitPrice: suggestion.estimatedUnitPrice || 45.00 }]
    });
    setShowPOModal(true);
  };

  const handleUpdatePOStatus = async (poId, newStatus, poNum) => {
    try {
      await purchaseOrderApi.updateStatus(poId, newStatus);
      setSuccess(`Purchase Order ${poNum} updated to ${newStatus}.`);
      if (selectedPO) setShowPODetailsModal(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update PO status.');
    }
  };

  // ---------------- GRN HANDLERS ----------------
  const handleOpenCreateGRN = (po) => {
    setSelectedPO(po);
    const grnItems = po.items.map(item => ({
      poItemId: item.id,
      drugId: item.drugId,
      drugName: item.drugName,
      batchNumber: `BAT-${item.drugCode || 'DRG'}-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: new Date(Date.now() + 365 * 2 * 86400000).toISOString().split('T')[0],
      receivedQuantity: item.quantity,
      unitPrice: item.unitPrice
    }));

    setGrnForm({
      purchaseOrderId: po.id,
      supplierId: po.supplierId,
      invoiceNumber: `INV-${po.poNumber}`,
      notes: `Received items against ${po.poNumber}`,
      items: grnItems
    });
    setShowGRNModal(true);
  };

  const handleCreateGRN = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await grnApi.create(grnForm);
      setSuccess('Goods Receipt Note (GRN) recorded successfully! Status set to PENDING_INSPECTION.');
      setShowGRNModal(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record GRN.');
    }
  };

  // ---------------- QUALITY INSPECTION HANDLERS ----------------
  const handleOpenQC = (grn) => {
    setSelectedGrnForQC(grn);
    const itemInspectionList = grn.items.map(item => ({
      grnItemId: item.id,
      drugName: item.drugName,
      batchNumber: item.batchNumber,
      receivedQuantity: item.receivedQuantity,
      acceptedQuantity: item.receivedQuantity,
      rejectedQuantity: 0,
      rejectionReason: ''
    }));

    setQcForm({
      grnId: grn.id,
      result: 'PASSED',
      remarks: 'All received items passed quality standards inspection.',
      itemInspections: itemInspectionList
    });
    setShowQCModal(true);
  };

  const handlePerformQC = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        grnId: qcForm.grnId,
        result: qcForm.result,
        remarks: qcForm.remarks,
        itemInspections: qcForm.itemInspections.map(i => ({
          grnItemId: i.grnItemId,
          acceptedQuantity: parseInt(i.acceptedQuantity),
          rejectedQuantity: parseInt(i.rejectedQuantity),
          rejectionReason: i.rejectionReason
        }))
      };
      await qualityInspectionApi.perform(payload);
      setSuccess('Quality Inspection completed! Usable inventory updated for accepted quantities.');
      setShowQCModal(false);
      loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Quality inspection failed.');
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={28} color="var(--primary-accent)" />
            Procurement & Supplier Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage suppliers, purchase orders, auto-drafting, goods receipts, and quality control inspection.
          </p>
        </div>
        <button onClick={loadAllData} className="btn btn-secondary" title="Refresh procurement data" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`btn ${activeTab === 'suppliers' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Truck size={16} /> Supplier Master ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('po')}
          className={`btn ${activeTab === 'po' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ShoppingBag size={16} /> Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('grn')}
          className={`btn ${activeTab === 'grn' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ClipboardCheck size={16} /> Goods Receipt (GRN) ({grns.length})
        </button>
        <button
          onClick={() => setActiveTab('qc')}
          className={`btn ${activeTab === 'qc' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ShieldCheck size={16} /> Quality Inspection ({grns.filter(g => g.status === 'PENDING_INSPECTION').length} Pending)
        </button>
      </div>

      {/* ================= TAB 1: SUPPLIER MASTER ================= */}
      {activeTab === 'suppliers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Registered Pharmaceutical Suppliers</h3>
            <button onClick={handleOpenAddSupplier} className="btn btn-primary">
              <Plus size={18} /> Add Supplier
            </button>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>Supplier Name</th>
                  <th style={{ padding: '0.75rem' }}>Contact Person</th>
                  <th style={{ padding: '0.75rem' }}>GSTIN</th>
                  <th style={{ padding: '0.75rem' }}>Contact Info</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No suppliers registered.</td></tr>
                ) : (
                  suppliers.map((sup) => (
                    <tr key={sup.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{sup.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{sup.contactPerson || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--primary-accent)', fontSize: '0.85rem' }}>{sup.gstin || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {sup.phone && <div>Ph: {sup.phone}</div>}
                        {sup.email && <div>Email: {sup.email}</div>}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${sup.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                          {sup.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button onClick={() => handleOpenEditSupplier(sup)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleSupplierStatus(sup.id, sup.isActive !== false, sup.name)}
                          className={`btn ${sup.isActive !== false ? 'btn-danger' : 'btn-primary'}`}
                          style={{ padding: '0.3rem 0.6rem' }}
                        >
                          {sup.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PURCHASE ORDERS ================= */}
      {activeTab === 'po' && (
        <div>
          {/* Auto PO Draft Trigger Panel */}
          {autoDrafts.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderColor: 'rgba(234, 179, 8, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#eab308' }}>
                <Zap size={20} />
                <h3 style={{ margin: 0 }}>Auto PO Draft Suggestions ({autoDrafts.length} Low-Stock Reorder Triggers)</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                The following drugs are below their configured reorder thresholds. Click "Create PO Draft" to pre-fill a Purchase Order.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {autoDrafts.map((draft) => (
                  <div key={draft.drugId} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{draft.drugName} ({draft.drugCode})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Current Stock: <strong style={{ color: 'var(--danger-color)' }}>{draft.currentStock}</strong> | Threshold: {draft.reorderLevel}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Suggested Reorder Qty: <strong>{draft.suggestedReorderQuantity}</strong>
                    </div>
                    <button
                      onClick={() => handleDraftFromSuggestion(draft)}
                      className="btn btn-primary"
                      style={{ marginTop: '0.75rem', width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} /> Create PO Draft
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Purchase Orders Overview</h3>
            <button onClick={handleOpenCreatePO} className="btn btn-primary">
              <Plus size={18} /> New Purchase Order
            </button>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>PO Number</th>
                  <th style={{ padding: '0.75rem' }}>Supplier</th>
                  <th style={{ padding: '0.75rem' }}>Order Date</th>
                  <th style={{ padding: '0.75rem' }}>Expected Delivery</th>
                  <th style={{ padding: '0.75rem' }}>Total Amount</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No purchase orders recorded.</td></tr>
                ) : (
                  purchaseOrders.map((po) => (
                    <tr key={po.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--primary-accent)' }}>{po.poNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{po.supplierName || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{po.orderDate}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{po.expectedDeliveryDate || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>₹{(po.totalAmount || 0).toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${
                          po.status === 'SENT' ? 'badge-primary' :
                          po.status === 'RECEIVED' ? 'badge-success' :
                          po.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button onClick={() => { setSelectedPO(po); setShowPODetailsModal(true); }} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}>
                          <Eye size={14} /> View
                        </button>
                        {po.status === 'DRAFT' && (
                          <button onClick={() => handleUpdatePOStatus(po.id, 'SENT', po.poNumber)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}>
                            <Send size={14} /> Send
                          </button>
                        )}
                        {po.status === 'SENT' && (
                          <button onClick={() => handleOpenCreateGRN(po)} className="btn btn-success" style={{ padding: '0.3rem 0.6rem' }}>
                            <ClipboardCheck size={14} /> Record GRN
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GOODS RECEIPT NOTE (GRN) ================= */}
      {activeTab === 'grn' && (
        <div>
          <h3>Goods Receipt Notes (GRN) Register</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            List of all shipments received against Purchase Orders. Status is set to <strong>PENDING_INSPECTION</strong> until Quality Control is completed.
          </p>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>GRN Number</th>
                  <th style={{ padding: '0.75rem' }}>PO Link</th>
                  <th style={{ padding: '0.75rem' }}>Supplier</th>
                  <th style={{ padding: '0.75rem' }}>Invoice No</th>
                  <th style={{ padding: '0.75rem' }}>Received Date</th>
                  <th style={{ padding: '0.75rem' }}>Inspection Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grns.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No Goods Receipt Notes recorded.</td></tr>
                ) : (
                  grns.map((grn) => (
                    <tr key={grn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--primary-accent)' }}>{grn.grnNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{grn.poNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{grn.supplierName}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{grn.invoiceNumber || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{grn.receivedDate}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${
                          grn.status === 'ACCEPTED' ? 'badge-success' :
                          grn.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {grn.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        {grn.status === 'PENDING_INSPECTION' && (
                          <button onClick={() => handleOpenQC(grn)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem' }}>
                            <ShieldCheck size={14} /> Perform QC
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: QUALITY INSPECTION ================= */}
      {activeTab === 'qc' && (
        <div>
          <h3>Quality Control Inspection Audit Log</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Inspection records of received goods. Accepted quantities are committed to usable stock; rejected quantities are recorded with reasons and excluded.
          </p>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>Inspection ID</th>
                  <th style={{ padding: '0.75rem' }}>GRN Ref</th>
                  <th style={{ padding: '0.75rem' }}>Inspector</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Result</th>
                  <th style={{ padding: '0.75rem' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {inspections.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No Quality Inspections performed yet.</td></tr>
                ) : (
                  inspections.map((qc) => (
                    <tr key={qc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>QC-INSP-#{qc.id}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--primary-accent)' }}>{qc.grnNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{qc.inspectedByName || 'Pharmacist / Quality Auditor'}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{qc.inspectionDate ? new Date(qc.inspectionDate).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${
                          qc.status === 'PASSED' ? 'badge-success' :
                          qc.status === 'FAILED' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {qc.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{qc.remarks || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: ADD/EDIT SUPPLIER ================= */}
      {showSupplierModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <h2>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            <form onSubmit={handleSaveSupplier} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Supplier Name *</label>
                <input type="text" className="form-input" required value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input type="text" className="form-input" value={supplierForm.contactPerson} onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">GSTIN Number</label>
                  <input type="text" className="form-input" placeholder="e.g. 27AAAAA0000A1Z5" value={supplierForm.gstin} onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-input" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input type="text" className="form-input" value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowSupplierModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingSupplier ? 'Update Supplier' : 'Save Supplier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CREATE PURCHASE ORDER ================= */}
      {showPOModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Create Purchase Order (Draft)</h2>
            <form onSubmit={handleCreatePO} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Supplier *</label>
                  <select className="form-select" required value={poForm.supplierId} onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}>
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Delivery Date *</label>
                  <input type="date" className="form-input" required value={poForm.expectedDeliveryDate} onChange={(e) => setPoForm({ ...poForm, expectedDeliveryDate: e.target.value })} />
                </div>
              </div>

              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Purchase Order Items</h4>
              {poForm.items.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <select className="form-select" required value={item.drugId} onChange={(e) => {
                    const newItems = [...poForm.items];
                    newItems[idx].drugId = e.target.value;
                    setPoForm({ ...poForm, items: newItems });
                  }}>
                    <option value="">-- Select Drug --</option>
                    {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                  </select>
                  <input type="number" min="1" className="form-input" placeholder="Qty" required value={item.quantity} onChange={(e) => {
                    const newItems = [...poForm.items];
                    newItems[idx].quantity = e.target.value;
                    setPoForm({ ...poForm, items: newItems });
                  }} />
                  <input type="number" step="0.01" min="0" className="form-input" placeholder="Unit Price" required value={item.unitPrice} onChange={(e) => {
                    const newItems = [...poForm.items];
                    newItems[idx].unitPrice = e.target.value;
                    setPoForm({ ...poForm, items: newItems });
                  }} />
                  <button type="button" onClick={() => handleRemovePOItemRow(idx)} className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }}>
                    <XCircle size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddPOItemRow} className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <Plus size={14} /> Add Another Drug Item
              </button>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Order Notes</label>
                <input type="text" className="form-input" placeholder="Special delivery instructions..." value={poForm.notes} onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowPOModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create PO Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: VIEW PO DETAILS ================= */}
      {showPODetailsModal && selectedPO && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Purchase Order: {selectedPO.poNumber}</h2>
              <span className="badge badge-primary">{selectedPO.status}</span>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div><strong>Supplier:</strong> {selectedPO.supplierName}</div>
              <div><strong>Order Date:</strong> {selectedPO.orderDate}</div>
              <div><strong>Expected Delivery:</strong> {selectedPO.expectedDeliveryDate || 'N/A'}</div>
              <div><strong>Total Amount:</strong> ₹{(selectedPO.totalAmount || 0).toFixed(2)}</div>
            </div>

            <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Ordered Drug Items</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Drug Name</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Qty</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedPO.items?.map(i => (
                  <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.5rem' }}>{i.drugName} ({i.drugCode})</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{i.quantity}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{(i.unitPrice || 0).toFixed(2)}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{(i.totalPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowPODetailsModal(false)} className="btn btn-secondary">Close</button>
              {selectedPO.status === 'DRAFT' && (
                <button onClick={() => handleUpdatePOStatus(selectedPO.id, 'SENT', selectedPO.poNumber)} className="btn btn-primary">
                  <Send size={14} /> Send PO to Supplier
                </button>
              )}
              {selectedPO.status === 'SENT' && (
                <button onClick={() => { setShowPODetailsModal(false); handleOpenCreateGRN(selectedPO); }} className="btn btn-success">
                  <ClipboardCheck size={14} /> Record Goods Receipt (GRN)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: RECORD GOODS RECEIPT (GRN) ================= */}
      {showGRNModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Record Goods Receipt Note (GRN)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Receiving shipment for Purchase Order: <strong>{selectedPO?.poNumber}</strong>
            </p>
            <form onSubmit={handleCreateGRN} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Supplier Invoice Number *</label>
                  <input type="text" className="form-input" required value={grnForm.invoiceNumber} onChange={(e) => setGrnForm({ ...grnForm, invoiceNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Receipt Notes</label>
                  <input type="text" className="form-input" placeholder="Condition of packages..." value={grnForm.notes} onChange={(e) => setGrnForm({ ...grnForm, notes: e.target.value })} />
                </div>
              </div>

              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Received Drug Items & Batch Information</h4>
              {grnForm.items.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.drugName}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Batch Number *</label>
                      <input type="text" className="form-input" required value={item.batchNumber} onChange={(e) => {
                        const newItems = [...grnForm.items];
                        newItems[idx].batchNumber = e.target.value;
                        setGrnForm({ ...grnForm, items: newItems });
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expiry Date *</label>
                      <input type="date" className="form-input" required value={item.expiryDate} onChange={(e) => {
                        const newItems = [...grnForm.items];
                        newItems[idx].expiryDate = e.target.value;
                        setGrnForm({ ...grnForm, items: newItems });
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Received Qty *</label>
                      <input type="number" min="1" className="form-input" required value={item.receivedQuantity} onChange={(e) => {
                        const newItems = [...grnForm.items];
                        newItems[idx].receivedQuantity = e.target.value;
                        setGrnForm({ ...grnForm, items: newItems });
                      }} />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowGRNModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit GRN (Pending QC)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: QUALITY INSPECTION ================= */}
      {showQCModal && selectedGrnForQC && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Quality Control Inspection</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Inspecting Goods Receipt: <strong>{selectedGrnForQC.grnNumber}</strong> (PO: {selectedGrnForQC.poNumber})
            </p>

            <form onSubmit={handlePerformQC} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Overall QC Decision *</label>
                  <select className="form-select" required value={qcForm.result} onChange={(e) => setQcForm({ ...qcForm, result: e.target.value })}>
                    <option value="PASSED">ACCEPT (All Passed)</option>
                    <option value="PARTIALLY_PASSED">PARTIALLY PASSED (Partial Rejection)</option>
                    <option value="FAILED">REJECT (All Failed)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Inspector Remarks / Audit Notes</label>
                  <input type="text" className="form-input" value={qcForm.remarks} onChange={(e) => setQcForm({ ...qcForm, remarks: e.target.value })} />
                </div>
              </div>

              <h4 style={{ marginBottom: '0.5rem' }}>Item Inspection Breakdown</h4>
              {qcForm.itemInspections.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {item.drugName} (Batch: {item.batchNumber})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Total Received Quantity: <strong>{item.receivedQuantity}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--success-color)' }}>Accepted Qty</label>
                      <input type="number" min="0" max={item.receivedQuantity} className="form-input" required value={item.acceptedQuantity} onChange={(e) => {
                        const newInsp = [...qcForm.itemInspections];
                        const acc = parseInt(e.target.value) || 0;
                        newInsp[idx].acceptedQuantity = acc;
                        newInsp[idx].rejectedQuantity = item.receivedQuantity - acc;
                        setQcForm({ ...qcForm, itemInspections: newInsp });
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--danger-color)' }}>Rejected Qty</label>
                      <input type="number" min="0" max={item.receivedQuantity} className="form-input" required value={item.rejectedQuantity} onChange={(e) => {
                        const newInsp = [...qcForm.itemInspections];
                        const rej = parseInt(e.target.value) || 0;
                        newInsp[idx].rejectedQuantity = rej;
                        newInsp[idx].acceptedQuantity = item.receivedQuantity - rej;
                        setQcForm({ ...qcForm, itemInspections: newInsp });
                      }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rejection Reason (if rejected)</label>
                      <input type="text" className="form-input" placeholder="e.g. Damaged seal, failed purity test" value={item.rejectionReason} onChange={(e) => {
                        const newInsp = [...qcForm.itemInspections];
                        newInsp[idx].rejectionReason = e.target.value;
                        setQcForm({ ...qcForm, itemInspections: newInsp });
                      }} />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowQCModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Quality Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementPage;
