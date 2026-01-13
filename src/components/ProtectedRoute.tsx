/**
 * Protected Route Component
 * Protegge le route che richiedono autenticazione
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostra loading mentre verifica la sessione
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: '#4A5565',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E5E7EB',
          borderTopColor: '#9810FA',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p>Verifica accesso...</p>
      </div>
    );
  }

  // Se non autenticato, redirect alla login
  if (!isAuthenticated) {
    return <Navigate to="/accedi" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
