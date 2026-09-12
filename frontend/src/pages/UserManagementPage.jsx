import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
  Users,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Save,
  Key
} from 'lucide-react';

const AVAILABLE_ROLES = [
  { value: 'ADMIN', label: 'Admin', class: 'admin' },
  { value: 'PHARMACIST', label: 'Pharmacist', class: 'pharmacist' },
  { value: 'DOCTOR', label: 'Doctor', class: 'doctor' },
  { value: 'STORE_MANAGER', label: 'Store Manager', class: 'store_manager' },
  { value: 'FINANCE', label: 'Finance', class: 'finance' },
  { value: 'PATIENT', label: 'Patient', class: 'patient' }
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
      // Initialize selected roles state
      const rolesMap = {};
      response.data.forEach(u => {
        rolesMap[u.id] = u.role;
      });
      setSelectedRoles(rolesMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const handleSaveRole = async (userId) => {
    const newRole = selectedRoles[userId];
    if (!newRole) return;

    try {
      setUpdatingId(userId);
      setError('');
      setSuccess('');
      const res = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setSuccess(`Role updated successfully for ${res.data.fullName} (${res.data.email}) -> ${res.data.role}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (u.fullName && u.fullName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(query)) ||
      (u.licenceNumber && u.licenceNumber.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query));

    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={28} color="var(--primary-accent)" />
            User & Role Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            System Administrator portal for reviewing accounts, modifying security roles, and auditing access levels.
          </p>
        </div>
        <button onClick={fetchUsers} className="btn btn-secondary" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh Users
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Role Distribution Stats */}
      <div className="grid-3" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Accounts</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.2rem' }}>{users.length}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pharmacists</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.2rem', color: '#34d399' }}>
            {users.filter(u => u.role === 'PHARMACIST').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Doctors</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.2rem', color: '#60a5fa' }}>
            {users.filter(u => u.role === 'DOCTOR').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Store Managers</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.2rem', color: '#fbbf24' }}>
            {users.filter(u => u.role === 'STORE_MANAGER').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Administrators</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.2rem', color: '#f87171' }}>
            {users.filter(u => u.role === 'ADMIN').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="search-toolbar" style={{ maxWidth: '720px' }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, employee ID, license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>

        <div style={{ width: '200px' }}>
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {AVAILABLE_ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* User Records Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading user list...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No user accounts found matching your query.
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>User Profile</th>
                <th style={{ padding: '1rem' }}>Identifiers</th>
                <th style={{ padding: '1rem' }}>Current Role</th>
                <th style={{ padding: '1rem' }}>Reassign Role</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const currentSelectedRole = selectedRoles[u.id] || u.role;
                const isChanged = currentSelectedRole !== u.role;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div>EMP: {u.employeeId || 'N/A'}</div>
                      <div>LIC: {u.licenceNumber || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`role-badge ${u.role?.toLowerCase()}`}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        className="form-select"
                        value={currentSelectedRole}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', minWidth: '160px' }}
                      >
                        {AVAILABLE_ROLES.map(r => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleSaveRole(u.id)}
                        className={`btn ${isChanged ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={!isChanged || updatingId === u.id}
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                      >
                        <Save size={14} />
                        {updatingId === u.id ? 'Updating...' : 'Save Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
