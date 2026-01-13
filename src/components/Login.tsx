import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Home, AlertCircle, Loader2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type LoginMode = 'email' | 'fiscal_code';

export function Login() {
  const [email, setEmail] = useState('');
  const [fiscalCode, setFiscalCode] = useState('');
  const [loginMode, setLoginMode] = useState<LoginMode>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Mostra errore da context o locale
  const displayError = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validazione
    if (loginMode === 'email' && !email.trim()) {
      setLocalError('Inserisci la tua email');
      return;
    }
    if (loginMode === 'fiscal_code' && !fiscalCode.trim()) {
      setLocalError('Inserisci il tuo codice fiscale');
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = loginMode === 'email'
        ? { email: email.trim() }
        : { fiscal_code: fiscalCode.trim().toUpperCase() };

      const response = await login(credentials);

      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError('Errore durante il login. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLoginMode = () => {
    setLoginMode(prev => prev === 'email' ? 'fiscal_code' : 'email');
    setLocalError(null);
    clearError();
  };

  return (
    <div className="login-container">
      {/* Back to Home - Outside card */}
      <Link to="/" className="back-to-home-link back-to-home-top">
        <Home size={16} />
        <span>Torna alla Home</span>
      </Link>

      <div className="login-card">
        {/* Left Side - Image with overlay */}
        <div className="login-image-section">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d630543fdbbec766b8cd287d7ce77c387ad1a359?width=1024"
            alt=""
            className="login-background-image"
          />
          <div className="login-image-overlay">
            <div className="login-image-content">
              <h2 className="login-image-title">Benvenuto in Innform</h2>
              <p className="login-image-description">
                La piattaforma per la tua crescita professionale. Accedi ai corsi, gestisci le tue iscrizioni e scopri nuove opportunità.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header">
              <div className="login-logo-placeholder"></div>
              <h1 className="login-title">Area Riservata Allievi</h1>
              <p className="login-subtitle">
                {loginMode === 'email'
                  ? 'Inserisci la tua email per accedere.'
                  : 'Inserisci il tuo codice fiscale per accedere.'}
              </p>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {loginMode === 'email' ? (
                /* Email Field */
                <div className="form-field">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="mario.rossi@email.com"
                      disabled={isSubmitting}
                    />
                    <Mail className="form-input-icon" size={20} strokeWidth={1.667} />
                  </div>
                </div>
              ) : (
                /* Fiscal Code Field */
                <div className="form-field">
                  <label htmlFor="fiscalCode" className="form-label">
                    Codice Fiscale
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      id="fiscalCode"
                      name="fiscalCode"
                      type="text"
                      autoComplete="off"
                      required
                      value={fiscalCode}
                      onChange={(e) => setFiscalCode(e.target.value.toUpperCase())}
                      className="form-input"
                      placeholder="RSSMRA80A01H501U"
                      maxLength={16}
                      disabled={isSubmitting}
                    />
                    <User className="form-input-icon" size={20} strokeWidth={1.667} />
                  </div>
                </div>
              )}

              {/* Toggle Login Mode */}
              <div className="form-toggle-mode">
                <button
                  type="button"
                  onClick={toggleLoginMode}
                  className="toggle-mode-link"
                  disabled={isSubmitting}
                >
                  {loginMode === 'email'
                    ? 'Accedi con Codice Fiscale'
                    : 'Accedi con Email'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="login-button-icon animate-spin" size={20} />
                    <span className="login-button-text">Accesso in corso...</span>
                  </>
                ) : (
                  <>
                    <span className="login-button-text">Accedi</span>
                    <ArrowRight className="login-button-icon" size={20} strokeWidth={1.667} />
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="login-footer">
              <span className="login-footer-text">Problemi di accesso? </span>
              <Link to="/contatti" className="register-link">
                Contatta la segreteria
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
