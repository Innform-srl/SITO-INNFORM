/**
 * Authentication Context
 * Gestisce lo stato di autenticazione globale dell'applicazione
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StudentAuthService, AuthenticatedStudent, LoginCredentials, StudentApiResponse } from '../services/student-auth-api';

// ============================================
// TIPI
// ============================================

interface AuthContextType {
  // Stato
  student: AuthenticatedStudent | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Azioni
  login: (credentials: LoginCredentials) => Promise<StudentApiResponse>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [student, setStudent] = useState<AuthenticatedStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica sessione esistente al mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const existingSession = StudentAuthService.getSession();
        if (existingSession) {
          setStudent(existingSession);
        }
      } catch (err) {
        console.error('[AuthContext] Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<StudentApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await StudentAuthService.login(credentials);

      if (response.success && response.data) {
        setStudent(response.data);
      } else if (response.error) {
        setError(response.error.message);
      }

      return response;
    } catch (err) {
      const errorMessage = 'Errore durante il login. Riprova più tardi.';
      setError(errorMessage);
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: errorMessage,
        },
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    StudentAuthService.logout();
    setStudent(null);
    setError(null);
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!student) return;

    setIsLoading(true);
    try {
      const response = await StudentAuthService.refreshSession();
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        // Se il refresh fallisce, effettua logout
        logout();
      }
    } catch (err) {
      console.error('[AuthContext] Error refreshing session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [student, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    student,
    isAuthenticated: !!student,
    isLoading,
    error,
    login,
    logout,
    refreshSession,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
