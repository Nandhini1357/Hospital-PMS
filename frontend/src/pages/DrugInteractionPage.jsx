import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import drugApi from '../api/drugApi';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Pill,
  ShieldAlert,
  Info,
  Search,
  Activity,
  HelpCircle
} from 'lucide-react';

const DrugInteractionPage = () => {
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [drug1Id, setDrug1Id] = useState('');
  const [drug2Id, setDrug2Id] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      try {
        const res = await drugApi.getAll();
        const drugList = res.data || [];
        setDrugs(drugList);
        if (drugList.length >= 2) {
          setDrug1Id(drugList[0].id.toString());
          setDrug2Id(drugList[1].id.toString());
        } else if (drugList.length === 1) {
          setDrug1Id(drugList[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch drugs:', err);
        setError('Failed to connect to drug inventory server.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrugs();
  }, []);

  const handleCheckInteraction = (e) => {
    if (e) e.preventDefault();
    if (!drug1Id || !drug2Id) {
      setResult({
        type: 'ERROR',
        title: 'Selection Incomplete',
        message: 'Please select two medications from the dropdown lists.'
      });
      return;
    }

    if (drug1Id === drug2Id) {
      setResult({
        type: 'WARNING',
        title: 'Same Medication Selected',
        message: 'You have selected the same drug for both Drug 1 and Drug 2. Please choose two distinct medications to evaluate cross-interaction.'
      });
      return;
    }

    const d1 = drugs.find((d) => d.id.toString() === drug1Id);
    const d2 = drugs.find((d) => d.id.toString() === drug2Id);

    if (!d1 || !d2) {
      setResult({
        type: 'ERROR',
        title: 'Invalid Selection',
        message: 'One or both selected medications could not be found in the catalog.'
      });
      return;
    }

    // Interactive Clinical Demo Engine
    // Check known interaction patterns (e.g. Narcotic + Sedative, Anticoagulant + NSAID, or Narcotic combination)
    const isD1Narcotic = d1.isNarcotic || (d1.name && d1.name.toLowerCase().includes('morphine')) || (d1.name && d1.name.toLowerCase().includes('fentanyl')) || (d1.name && d1.name.toLowerCase().includes('codeine')) || (d1.name && d1.name.toLowerCase().includes('pethidine'));
    const isD2Narcotic = d2.isNarcotic || (d2.name && d2.name.toLowerCase().includes('morphine')) || (d2.name && d2.name.toLowerCase().includes('fentanyl')) || (d2.name && d2.name.toLowerCase().includes('codeine')) || (d2.name && d2.name.toLowerCase().includes('pethidine'));

    const isD1NSAID = (d1.genericName && d1.genericName.toLowerCase().includes('ibuprofen')) || (d1.genericName && d1.genericName.toLowerCase().includes('aspirin')) || (d1.genericName && d1.genericName.toLowerCase().includes('diclofenac')) || (d1.name && d1.name.toLowerCase().includes('aspirin'));
    const isD2NSAID = (d2.genericName && d2.genericName.toLowerCase().includes('ibuprofen')) || (d2.genericName && d2.genericName.toLowerCase().includes('aspirin')) || (d2.genericName && d2.genericName.toLowerCase().includes('diclofenac')) || (d2.name && d2.name.toLowerCase().includes('aspirin'));

    const isD1Anticoagulant = (d1.genericName && d1.genericName.toLowerCase().includes('warfarin')) || (d1.genericName && d1.genericName.toLowerCase().includes('heparin')) || (d1.genericName && d1.genericName.toLowerCase().includes('rivaroxaban'));
    const isD2Anticoagulant = (d2.genericName && d2.genericName.toLowerCase().includes('warfarin')) || (d2.genericName && d2.genericName.toLowerCase().includes('heparin')) || (d2.genericName && d2.genericName.toLowerCase().includes('rivaroxaban'));

    const sameCategory = d1.categoryId && d2.categoryId && d1.categoryId === d2.categoryId;

    if ((isD1Narcotic && isD2Narcotic) || (isD1Anticoagulant && isD2NSAID) || (isD2Anticoagulant && isD1NSAID)) {
      setResult({
        type: 'INTERACTION_CRITICAL',
        severity: 'CRITICAL / HIGH RISK',
        title: 'Potential interaction detected — pharmacist review required.',
        drug1: d1,
        drug2: d2,
        mechanism: 'Severe Synergistic / Pharmacodynamic Cross-Interaction.',
        description: `Concurrent administration of ${d1.name} and ${d2.name} increases the risk of severe adverse drug events (CNS depression, respiratory depression, or acute gastrointestinal hemorrhage).`,
        guidance: 'Mandatory clinical consultation with prescribing physician required before verification or dispensing. Document justification in pharmacy log.'
      });
    } else if (sameCategory || isD1Narcotic || isD2Narcotic) {
      setResult({
        type: 'INTERACTION_MAJOR',
        severity: 'MODERATE / MAJOR',
        title: 'Potential interaction detected — pharmacist review required.',
        drug1: d1,
        drug2: d2,
        mechanism: 'Therapeutic Duplication or Controlled Substance Co-prescribing.',
        description: `Both ${d1.name} and ${d2.name} share overlapping therapeutic classes or controlled substance monitoring protocols.`,
        guidance: 'Pharmacist review advised. Verify dosage intervals and monitor patient for additive side effects.'
      });
    } else {
      setResult({
        type: 'NO_INTERACTION',
        title: 'No interaction found in demo database',
        drug1: d1,
        drug2: d2,
        description: `No major direct cross-interactions identified between ${d1.name} (${d1.genericName || 'Generic'}) and ${d2.name} (${d2.genericName || 'Generic'}) in the current clinical rule matrix.`,
        guidance: 'Standard dispensing guidelines apply. Always verify patient allergy records and clinical history.'
      });
    }
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
          Clinical Decision Support System (CDSS)
        </span>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert size={28} color="var(--primary-accent)" />
          Check Drug Interactions
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select two medications to check for potential clinical cross-interactions, contraindications, or severe reactions.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading medication catalog...
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#f87171' }}>
          <AlertTriangle size={36} color="#f87171" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Selection Form */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill size={20} color="var(--primary-accent)" />
              Select Medications to Cross-Check
            </h2>

            <form onSubmit={handleCheckInteraction}>
              {/* Drug 1 Dropdown */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  First Medication (Drug 1):
                </label>
                <select
                  className="form-control"
                  value={drug1Id}
                  onChange={(e) => setDrug1Id(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="">-- Select Drug 1 --</option>
                  {drugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code}) {d.genericName ? `- ${d.genericName}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drug 2 Dropdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Second Medication (Drug 2):
                </label>
                <select
                  className="form-control"
                  value={drug2Id}
                  onChange={(e) => setDrug2Id(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="">-- Select Drug 2 --</option>
                  {drugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code}) {d.genericName ? `- ${d.genericName}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <Activity size={18} />
                Check Interaction
              </button>
            </form>
          </div>

          {/* Right Interaction Results Display */}
          <div>
            {!result ? (
              <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Info size={44} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Ready to Cross-Check
                </h3>
                <p style={{ fontSize: '0.9rem' }}>
                  Select Drug 1 and Drug 2 from the medication dropdowns and click <strong>"Check Interaction"</strong> to evaluate potential cross-reactions.
                </p>
              </div>
            ) : result.type === 'WARNING' || result.type === 'ERROR' ? (
              <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={24} color="#f59e0b" />
                  <h3 style={{ fontSize: '1.15rem', color: '#f59e0b', margin: 0 }}>{result.title}</h3>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{result.message}</p>
              </div>
            ) : result.type.startsWith('INTERACTION_') ? (
              <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(239,68,68,0.2)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldAlert size={26} color="#ef4444" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        CLINICAL WARNING ({result.severity})
                      </span>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0.1rem 0' }}>
                        {result.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--subtle-bg)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Medication 1:</span>
                    <strong style={{ color: 'var(--primary-accent)' }}>{result.drug1.name}</strong> ({result.drug1.code})
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Medication 2:</span>
                    <strong style={{ color: 'var(--primary-accent)' }}>{result.drug2.name}</strong> ({result.drug2.code})
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Mechanism & Interaction Details:
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--subtle-bg)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    {result.description}
                  </p>
                </div>

                <div style={{ background: 'var(--alert-error-bg)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--alert-error-border)', fontSize: '0.85rem', color: 'var(--alert-error-text)' }}>
                  <strong>Pharmacist Clinical Guidance:</strong> {result.guidance}
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid var(--success-color)', background: 'var(--alert-success-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid var(--alert-success-border)', paddingBottom: '0.75rem' }}>
                  <CheckCircle2 size={26} color="var(--success-color)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      CROSS-MATCH CLEARANCE
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--success-color)', margin: '0.1rem 0' }}>
                      {result.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--subtle-bg)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Medication 1:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{result.drug1.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Medication 2:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{result.drug2.name}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {result.description}
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Info size={14} color="#34d399" style={{ display: 'inline', marginRight: '0.4rem' }} />
                  {result.guidance}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionPage;
