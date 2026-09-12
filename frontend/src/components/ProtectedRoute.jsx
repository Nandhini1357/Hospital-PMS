import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading application context...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="main-content">
        <div className="alert alert-error glass-panel" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2>403 Forbidden Access</h2>
          <p>Your authenticated role ({role}) does not have permission to view this resource.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
