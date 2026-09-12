import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Pill, FileText, AlertTriangle, ShieldCheck, Clock, CheckCircle2, ArrowUpRight, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleActionClick = (action) => {
    switch (action) {
      case 'Manage User Roles':
        navigate('/admin/users');
        break;
      case 'Generate CDSCO Narcotics Package':
      case 'View Tamper-Evident Logs':
        navigate('/narcotics');
        break;
      case 'View Dispensing Queue':
        navigate('/prescriptions/pending');
        break;
      case 'Scan Drug Barcode':
        navigate('/inventory/barcode-scanner');
        break;
      case 'Check Drug Interactions':
        navigate('/inventory/drug-interactions');
        break;
      case 'Create E-Prescription':
        navigate('/prescriptions/new');
        break;
      case 'Search Medication Profile':
      case 'Review Patient History':
        navigate('/medication-history');
        break;
      case 'Auto-Generate PO Drafts':
      case 'Process Goods Receipt Note':
        navigate('/procurement');
        break;
      case 'Stock Expiry Calendar':
        navigate('/inventory/expiry-alerts');
        break;
      case 'View My Prescriptions':
        navigate('/prescriptions');
        break;
      case 'Schedule Counter Collection':
        navigate('/patient/counter-collection');
        break;
      case 'Pay Invoice Online':
        navigate('/patient/invoices');
        break;
      case 'Generate GST Invoice':
        navigate('/finance/gst-invoice');
        break;
      case 'Submit Insurance Pre-Auth':
        navigate('/finance/insurance-preauth');
        break;
      case 'View Dues Ageing Report':
        navigate('/finance/dues-ageing');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/profile');
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getRoleMetrics = () => {
    switch (user?.role) {
      case 'PHARMACIST':
        return [
          { title: 'Pending Queue', value: '14', desc: 'Prescriptions awaiting dispense', icon: FileText, color: '#60a5fa' },
          { title: 'FEFO Stock Alerts', value: '3', desc: 'Items near 60-day expiry threshold', icon: AlertTriangle, color: '#fbbf24' },
          { title: 'Shift Turnaround', value: '4.2 min', desc: 'Average dispensing speed', icon: Clock, color: '#34d399' }
        ];
      case 'DOCTOR':
        return [
          { title: 'Active Prescriptions', value: '28', desc: 'Issued in last 24 hours', icon: FileText, color: '#60a5fa' },
          { title: 'Interaction Alerts', value: '2', desc: 'CRITICAL/MAJOR cross-match warnings', icon: AlertTriangle, color: '#f87171' },
          { title: 'Reconciliation AI', value: '99.4%', desc: 'Medication list accuracy score', icon: CheckCircle2, color: '#34d399' }
        ];
      case 'STORE_MANAGER':
        return [
          { title: 'Reorder Triggers', value: '8', desc: 'Drugs below configured reorder point', icon: AlertTriangle, color: '#fbbf24' },
          { title: 'Pending POs', value: '5', desc: 'Draft POs awaiting supplier quotes', icon: FileText, color: '#60a5fa' },
          { title: 'GRN Inspection', value: '2', desc: 'Inward deliveries ready for quality check', icon: Pill, color: '#c084fc' }
        ];
      case 'FINANCE':
        return [
          { title: 'Daily Collections', value: '₹1,42,850', desc: 'Pharmacy collection total', icon: CheckCircle2, color: '#34d399' },
          { title: 'Pending Insurance', value: '₹58,400', desc: 'TPA cashless pre-auth claims', icon: Clock, color: '#60a5fa' },
          { title: 'Ageing Dues (>30d)', value: '₹12,200', desc: 'Patient outstanding ledger balance', icon: AlertTriangle, color: '#f87171' }
        ];
      case 'ADMIN':
        return [
          { title: 'Active Staff Users', value: '42', desc: 'Verified system users across roles', icon: ShieldCheck, color: '#34d399' },
          { title: 'CDSCO Report Status', value: 'Ready', desc: 'Monthly narcotics audit summary', icon: CheckCircle2, color: '#60a5fa' },
          { title: 'Security Audit Logs', value: '1,280', desc: 'Logged security events past 7 days', icon: Activity, color: '#c084fc' }
        ];
      case 'PATIENT':
      default:
        return [
          { title: 'Prescription Status', value: 'READY', desc: 'Prescription verified & packed', icon: CheckCircle2, color: '#34d399' },
          { title: 'Collection Queue', value: 'Counter #2', desc: 'Present QR receipt for collection', icon: Clock, color: '#60a5fa' },
          { title: 'Medication Schedule', value: '3 Active', desc: 'Daily adherence push alerts active', icon: Pill, color: '#c084fc' }
        ];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'PHARMACIST':
        return ['View Dispensing Queue', 'Scan Drug Barcode', 'Check Drug Interactions'];
      case 'DOCTOR':
        return ['Create E-Prescription', 'Search Medication Profile', 'Review Patient History'];
      case 'STORE_MANAGER':
        return ['Auto-Generate PO Drafts', 'Process Goods Receipt Note', 'Stock Expiry Calendar'];
      case 'FINANCE':
        return ['Generate GST Invoice', 'Submit Insurance Pre-Auth', 'View Dues Ageing Report'];
      case 'ADMIN':
        return ['Manage User Roles', 'Generate CDSCO Narcotics Package', 'View Tamper-Evident Logs'];
      case 'PATIENT':
      default:
        return ['View My Prescriptions', 'Pay Invoice Online', 'Schedule Counter Collection'];
    }
  };

  if (loading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '4rem' }}>Loading role dashboard...</div>;
  }

  const metrics = getRoleMetrics();
  const quickActions = getQuickActions();

  return (
    <div className="main-content">
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AUTHENTICATED WORKSPACE
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Welcome, {profile?.fullName || user?.fullName}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Role: <span className={`role-badge ${user?.role?.toLowerCase()}`}>{user?.role?.replace('_', ' ')}</span> | Email: {user?.email}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              onClick={() => handleActionClick(action)}
            >
              {action} <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Role KPI Summary Metrics</h2>
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{metric.title}</span>
                <div style={{ background: `${metric.color}20`, padding: '0.5rem', borderRadius: '8px' }}>
                  <Icon size={20} color={metric.color} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {metric.value}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{metric.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Feed */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-accent)" />
          Recent Activity Feed & Audit Stream
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>User Authentication Verified</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>JWT Session issued with role claim: {user?.role}</p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Just now</span>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>FEFO Index Check Completed</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Database query `ORDER BY expiry_date ASC` optimized</p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>5 mins ago</span>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Security Audit Log Entry</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Logged access from IP: 127.0.0.1</p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>12 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
