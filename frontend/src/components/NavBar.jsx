import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Pill, LogOut, User as UserIcon, LayoutDashboard, FileText, Package, Lock, Truck, Sun, Moon } from 'lucide-react';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Pill size={28} className="brand-icon" />
        <span>Hospital Pharmacy System</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
            Home
          </Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'nav-active' : ''}`}>
                <LayoutDashboard size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/patients" className={`nav-link ${isActive('/patients') ? 'nav-active' : ''}`}>
                <UserIcon size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Patients
              </Link>
            </li>
            <li>
              <Link to="/prescriptions" className={`nav-link ${isActive('/prescriptions') ? 'nav-active' : ''}`}>
                <FileText size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Prescriptions
              </Link>
            </li>
            {user?.role === 'PHARMACIST' && (
              <li>
                <Link to="/prescriptions/pending" className={`nav-link ${isActive('/prescriptions/pending') ? 'nav-active' : ''}`}>
                  <Package size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Dispensing Queue
                </Link>
              </li>
            )}
            <li>
              <Link to="/inventory" className={`nav-link ${isActive('/inventory') ? 'nav-active' : ''}`}>
                <Package size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Inventory
              </Link>
            </li>
            {['PHARMACIST', 'STORE_MANAGER', 'ADMIN'].includes(user?.role) && (
              <>
                <li>
                  <Link to="/procurement" className={`nav-link ${isActive('/procurement') ? 'nav-active' : ''}`}>
                    <Truck size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Procurement
                  </Link>
                </li>
                <li>
                  <Link to="/narcotics" className={`nav-link ${isActive('/narcotics') ? 'nav-active' : ''}`}>
                    <Lock size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Narcotics Register
                  </Link>
                </li>
              </>
            )}
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'nav-active' : ''}`}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={`nav-link ${isActive('/register') ? 'nav-active' : ''}`}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isAuthenticated && (
          <div className="nav-user-badge">
            <UserIcon size={18} color="var(--primary-accent)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.fullName}</span>
            <span className={`role-badge ${user?.role?.toLowerCase()}`}>
              {user?.role?.replace('_', ' ')}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', marginLeft: '0.5rem' }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
