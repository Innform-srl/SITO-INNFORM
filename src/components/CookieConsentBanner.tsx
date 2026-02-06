import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from './ui/button';

const COOKIE_CONSENT_KEY = 'innform_cookie_consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  consentDate: string;
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // sempre attivi
    analytics: false,
    marketing: false,
    consentDate: '',
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Mostra subito il banner
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consent = {
      ...prefs,
      consentDate: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      consentDate: '',
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      consentDate: '',
    });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  const bannerContent = (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999999 }}>
      {/* Overlay scuro quando settings aperto */}
      {showSettings && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999998 }}
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Banner principale */}
      <div className={`transition-transform duration-300 ${showSettings ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Icona e testo */}
              <div className="flex items-start gap-4 flex-1">
                <div className="hidden sm:flex p-3 bg-amber-100 rounded-xl flex-shrink-0">
                  <Cookie className="text-amber-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Cookie className="text-amber-600 sm:hidden" size={20} />
                    Informativa sui Cookie
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Utilizziamo cookie tecnici necessari e, con il tuo consenso, cookie analitici per migliorare la tua esperienza.
                    Leggi la nostra{' '}
                    <Link to="/cookie-policy" className="text-purple-600 hover:underline font-medium">
                      Cookie Policy
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacy-policy" className="text-purple-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Bottoni */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <Settings size={16} className="mr-2" />
                  Personalizza
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Solo necessari
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Check size={16} className="mr-2" />
                  Accetta tutti
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pannello impostazioni */}
      {showSettings && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999999 }}>
          <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.2)] max-h-[80vh] overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="text-purple-600" size={24} />
                  Preferenze Cookie
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Chiudi"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Cookie categories */}
              <div className="space-y-4 mb-6">
                {/* Cookie Necessari */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Cookie Necessari</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Sempre attivi
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Essenziali per il funzionamento del sito. Non possono essere disattivati.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookie Analitici */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Cookie Analitici</h4>
                      <p className="text-sm text-gray-600">
                        Ci aiutano a capire come utilizzi il sito per migliorare l'esperienza utente.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                        aria-label={preferences.analytics ? 'Disattiva cookie analitici' : 'Attiva cookie analitici'}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cookie Marketing */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Cookie di Marketing</h4>
                      <p className="text-sm text-gray-600">
                        Utilizzati per mostrarti annunci pertinenti in base ai tuoi interessi.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.marketing ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                        aria-label={preferences.marketing ? 'Disattiva cookie marketing' : 'Attiva cookie marketing'}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="text-sm text-gray-500 mb-6">
                Per maggiori informazioni, consulta la nostra{' '}
                <Link to="/cookie-policy" className="text-purple-600 hover:underline">Cookie Policy</Link>
                {' '}e la{' '}
                <Link to="/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={acceptNecessary}
                  className="flex-1 border-gray-300"
                >
                  Solo necessari
                </Button>
                <Button
                  onClick={savePreferences}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Salva preferenze
                </Button>
                <Button
                  onClick={acceptAll}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Accetta tutti
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Usa createPortal per renderizzare direttamente nel body
  return createPortal(bannerContent, document.body);
}

// Hook per verificare le preferenze cookie salvate
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  return consent;
}

// Funzione per resettare il consenso (utile per testing o per permettere all'utente di modificare)
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.location.reload();
}
