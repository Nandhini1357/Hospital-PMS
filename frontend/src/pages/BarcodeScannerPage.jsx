import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import drugApi from '../api/drugApi';
import {
  Barcode,
  Search,
  ArrowLeft,
  Pill,
  Package,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Layers,
  RotateCcw
} from 'lucide-react';

const BarcodeScannerPage = () => {
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [scannedDrug, setScannedDrug] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      try {
        const res = await drugApi.getAll();
        setDrugs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch drug catalog:', err);
        setError('Failed to connect to drug inventory server.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrugs();
  }, []);

  const handleScanSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    if (!query) {
      setScannedDrug(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    // Find matching drug by code/SKU (barcode), name, generic name, or ID
    const match = drugs.find(
      (d) =>
        (d.code && d.code.toLowerCase() === query) ||
        (d.name && d.name.toLowerCase().includes(query)) ||
        (d.genericName && d.genericName.toLowerCase().includes(query)) ||
        d.id.toString() === query
    );

    setScannedDrug(match || null);
  };

  const handleQuickSelect = (drug) => {
    setSearchCode(drug.code || drug.name);
    setScannedDrug(drug);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchCode('');
    setScannedDrug(null);
    setHasSearched(false);
  };

  return (
    <div className="main-content">
      {/* Header Banner & Navigation */}
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
          Hospital Pharmacy Barcode Verification System
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Barcode size={28} color="var(--primary-accent)" />
          Scan Drug Barcode
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Scan or enter a drug barcode / SKU code to instantly look up inventory stock and medication details.
        </p>
      </div>

      {/* Barcode Search & Scan Form */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleScanSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Scan barcode or enter Drug Code / SKU (e.g., DRG-PCM-001)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem', fontSize: '1rem' }}
              autoFocus
            />
            <Barcode size={20} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <Search size={18} style={{ marginRight: '0.4rem' }} />
            Scan / Search
          </button>
          {hasSearched && (
            <button type="button" className="btn btn-secondary" onClick={handleReset} style={{ padding: '0.75rem 1rem' }}>
              <RotateCcw size={16} style={{ marginRight: '0.4rem' }} />
              Reset
            </button>
          )}
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          * Hardware barcode scanners automatically emulate keyboard input. Manual typing supported for demo/testing.
        </p>

        {/* Quick Demo Selector Chips */}
        {drugs.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Quick Scan Demo Shortcuts (Available Drugs in Catalog):
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {drugs.slice(0, 6).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '16px' }}
                  onClick={() => handleQuickSelect(d)}
                >
                  <Tag size={12} style={{ marginRight: '0.3rem' }} />
                  {d.code} ({d.name})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading drug inventory database...
        </div>
      ) : hasSearched && !scannedDrug ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', border: '1px solid #f87171' }}>
          <AlertTriangle size={48} color="#f87171" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#f87171', marginBottom: '0.5rem' }}>Drug Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1rem' }}>
            No medication in the system matches barcode / code: <strong>"{searchCode}"</strong>. Please verify the code or check the Drug Master Catalog.
          </p>
          <button className="btn btn-secondary" onClick={handleReset}>
            Try Scanning Another Code
          </button>
        </div>
      ) : scannedDrug ? (
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--primary-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MATCH FOUND — BARCODE VERIFIED
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {scannedDrug.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Generic Name: <strong>{scannedDrug.genericName || 'N/A'}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="role-badge pharmacist" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                SKU / Barcode: {scannedDrug.code}
              </span>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-accent)', marginTop: '0.25rem' }}>
                {scannedDrug.categoryName || 'General Pharmaceutical'}
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Unit of Measurement</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {scannedDrug.unit || 'Units'}
              </div>
            </div>

            <div className="card" style={{ background: scannedDrug.totalStock <= (scannedDrug.reorderLevel || 10) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(52, 211, 153, 0.1)', borderColor: scannedDrug.totalStock <= (scannedDrug.reorderLevel || 10) ? '#f87171' : '#34d399' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Available Stock</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: scannedDrug.totalStock <= (scannedDrug.reorderLevel || 10) ? '#f87171' : '#34d399', marginTop: '0.25rem' }}>
                {scannedDrug.totalStock || 0} {scannedDrug.unit || 'units'}
              </div>
            </div>
          </div>

          {/* Description & Statutory Notes */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Medication Specifications & Classification
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {scannedDrug.description || 'Standard pharmaceutical drug catalog entry verified for FEFO allocation.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <span style={{ color: scannedDrug.isScheduleH1 ? '#f59e0b' : 'var(--text-muted)' }}>
                • Schedule H1 Prescription: {scannedDrug.isScheduleH1 ? 'YES' : 'NO'}
              </span>
              <span style={{ color: scannedDrug.isNarcotic ? '#ef4444' : 'var(--text-muted)' }}>
                • Controlled Narcotic: {scannedDrug.isNarcotic ? 'YES (Statutory Register Active)' : 'NO'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                • Reorder Level Threshold: {scannedDrug.reorderLevel || 10} units
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BarcodeScannerPage;
