import React, { useState, useEffect } from 'react';
import { getCDSCOReport } from '../api/narcoticsApi';
import { FileText, Download, Printer, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

const CDSCOReportGenerator = () => {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [month]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCDSCOReport(month);
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate statutory CDSCO compliance report.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report || !report.transactions) return;

    const headers = [
      'Transaction ID',
      'Timestamp',
      'Type',
      'Drug Name',
      'Drug Code',
      'Batch No',
      'Quantity',
      'Opening Balance',
      'Closing Balance',
      'Primary Pharmacist',
      'Secondary Pharmacist',
      'Manufacturer',
      'Supplier Invoice',
      'Doctor Name',
      'Patient Name',
      'Verification Hash'
    ];

    const rows = report.transactions.map((t) => [
      t.id,
      new Date(t.timestamp).toLocaleString(),
      t.transactionType,
      `"${t.drugName || ''}"`,
      t.drugCode,
      t.batchNo,
      t.quantity,
      t.openingBalance,
      t.closingBalance,
      `"${t.primaryPharmacistName || ''}"`,
      `"${t.secondaryPharmacistName || ''}"`,
      `"${t.manufacturer || ''}"`,
      `"${t.supplierInvoice || ''}"`,
      `"${t.doctorName || ''}"`,
      `"${t.patientName || ''}"`,
      t.verificationHash || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CDSCO_Narcotics_Report_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      {/* Printable Header */}
      <div className="report-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText color="var(--primary-accent)" size={24} /> CDSCO Statutory Narcotics Compliance Report
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Central Drugs Standard Control Organisation (India) monthly register report.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--text-muted)" />
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={!report || loading}>
            <Download size={16} style={{ marginRight: 4 }} /> Excel / CSV
          </button>
          <button className="btn btn-primary" onClick={handlePrintPDF} disabled={!report || loading}>
            <Printer size={16} style={{ marginRight: 4 }} /> Export PDF / Print
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Generating monthly narcotics report...</div>
      ) : report ? (
        <div>
          {/* Summary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--card-bg-light, #1E293B)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL TRANSACTIONS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem' }}>{report.totalTransactions}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid #3B82F6', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#3B82F6' }}>TOTAL DISPENSED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6', marginTop: '0.2rem' }}>{report.totalDispensed}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid #10B981', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#10B981' }}>TOTAL RECEIVED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981', marginTop: '0.2rem' }}>{report.totalReceived}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #EF4444', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#EF4444' }}>TOTAL DESTROYED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EF4444', marginTop: '0.2rem' }}>{report.totalDestroyed}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid #F59E0B', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#F59E0B' }}>EMERGENCY OVERRIDES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B', marginTop: '0.2rem' }}>{report.totalEmergencyOverrides}</div>
            </div>
          </div>

          {/* Controlled Drug Monthly Summary */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Controlled Substances Monthly Stock Summary</h3>
          {report.drugSummaries && report.drugSummaries.length > 0 ? (
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Drug Name</th>
                    <th>Classification</th>
                    <th>Opening Bal</th>
                    <th>Received</th>
                    <th>Dispensed</th>
                    <th>Destroyed</th>
                    <th>Closing Bal</th>
                  </tr>
                </thead>
                <tbody>
                  {report.drugSummaries.map((ds) => (
                    <tr key={ds.drugId}>
                      <td>
                        <strong>{ds.drugName}</strong> ({ds.drugCode})
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'var(--primary-accent)', color: '#FFF' }}>
                          {ds.classification}
                        </span>
                      </td>
                      <td>{ds.openingBalance}</td>
                      <td style={{ color: '#10B981' }}>+{ds.totalReceived}</td>
                      <td style={{ color: '#3B82F6' }}>-{ds.totalDispensed}</td>
                      <td style={{ color: '#EF4444' }}>-{ds.totalDestroyed}</td>
                      <td><strong>{ds.closingBalance}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>No summary data available for this month.</div>
          )}

          {/* Detailed Transaction Ledger */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Statutory Register Transaction Logs ({month})</h3>
          {report.transactions && report.transactions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Drug</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>Bal (Op/Cl)</th>
                    <th>Pharmacists</th>
                    <th>Audit Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {report.transactions.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(t.timestamp).toLocaleString()}</td>
                      <td><strong>{t.transactionType}</strong></td>
                      <td>{t.drugName}</td>
                      <td><code>{t.batchNo}</code></td>
                      <td>{t.quantity}</td>
                      <td>{t.openingBalance} → {t.closingBalance}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        Primary: {t.primaryPharmacistName}
                        {t.secondaryPharmacistName && <div>Secondary: {t.secondaryPharmacistName}</div>}
                      </td>
                      <td>
                        <code style={{ fontSize: '0.7rem', color: '#10B981' }}>{t.verificationHash ? t.verificationHash.substring(0, 16) + '...' : 'VERIFIED'}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No narcotics transactions recorded for month {month}.</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CDSCOReportGenerator;
