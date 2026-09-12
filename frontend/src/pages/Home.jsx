import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Stethoscope, Store, CircleDollarSign, UserCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  const roles = [
    { name: 'Pharmacists', icon: Pill, desc: 'Prescription dispensing, FEFO inventory, interaction verification', color: '#34d399' },
    { name: 'Doctors', icon: Stethoscope, desc: 'E-Prescription entry, medication history, clinical alerts', color: '#60a5fa' },
    { name: 'Store Managers', icon: Store, desc: 'Drug procurement, supplier POs, GRN, stock control', color: '#fbbf24' },
    { name: 'Finance Officers', icon: CircleDollarSign, desc: 'Itemized billing, GST invoices, insurance claims', color: '#c084fc' },
    { name: 'Administrators', icon: ShieldCheck, desc: 'Full compliance oversight, audit logs, narcotics register', color: '#f87171' },
    { name: 'Patients', icon: UserCheck, desc: 'Prescription tracking, payment history, collection status', color: '#f472b6' }
  ];

  return (
    <div className="main-content">
      <section style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
          Hospital Pharmacy Management System
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2rem auto' }}>
          Streamlined, secure, and compliant pharmaceutical operations platform. FEFO inventory management, real-time drug interaction checks, and dual-authorized narcotics registers.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Access Workspace <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Register User Account
          </Link>
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Role-Based Operational Workspaces</h2>
        <div className="grid-3">
          {roles.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div key={idx} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: `${r.color}20`, padding: '0.75rem', borderRadius: '12px' }}>
                    <Icon size={24} color={r.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem' }}>{r.name}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{r.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
