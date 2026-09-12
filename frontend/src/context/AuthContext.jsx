import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  // 20-minute inactivity auto-logout threshold per SRS FR2
  const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000;

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (token) {
      inactivityTimerRef.current = setTimeout(() => {
        logout('Session timed out after 20 minutes of inactivity.');
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    // Restore session from localStorage
    const savedToken = localStorage.getItem('hpms_token');
    const savedUser = localStorage.getItem('hpms_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('hpms_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      // Setup activity listeners for 20-min auto-logout
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      const handleActivity = () => resetInactivityTimer();

      events.forEach((evt) => window.addEventListener(evt, handleActivity));
      resetInactivityTimer();

      return () => {
        events.forEach((evt) => window.removeEventListener(evt, handleActivity));
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      };
    }
  }, [token]);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('hpms_token', authToken);
    localStorage.setItem('hpms_user', JSON.stringify(userData));
  };

  const logout = async (reason) => {
    try {
      if (token) {
        await api.post('/api/auth/logout');
      }
    } catch (e) {
      // Ignore logout API error if offline
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('hpms_token');
      localStorage.removeItem('hpms_user');
      if (reason) {
        alert(reason);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
