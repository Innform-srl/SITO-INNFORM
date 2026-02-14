/**
 * Componenti Form React per Sito Innform.eu
 * Pronti per essere integrati nel sito Figma Make
 * 
 * Include:
 * - EnrollmentForm: Form completo iscrizione corso
 * - ContactForm: Form contatto/richiesta info
 * - PreEnrollmentForm: Form pre-iscrizione GOL/Master
 */

import React, { useState } from 'react';
import {
  useEnrollmentForm,
  useContactForm,
  usePreEnrollmentForm,
  EnrollmentFormInput,
  ContactFormInput,
  PreEnrollmentFormInput,
} from '../hooks/useEduPlanForms';

// ============================================
// STILI COMUNI (Tailwind CSS)
// ============================================

const inputStyles = `
  w-full px-4 py-3
  border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-200
  placeholder:text-gray-400
`;

const labelStyles = `
  block text-sm font-medium text-gray-700 mb-1
`;

const errorStyles = `
  text-red-500 text-sm mt-1
`;

const buttonStyles = `
  w-full py-3 px-6 
  bg-blue-600 text-white font-semibold rounded-lg
  hover:bg-blue-700 
  disabled:bg-gray-400 disabled:cursor-not-allowed
  transition-all duration-200
`;

const successBoxStyles = `
  bg-green-50 border border-green-200 rounded-lg p-6 text-center
`;

// ============================================
// ENROLLMENT FORM (Iscrizione Corso)
// ============================================

interface EnrollmentFormProps {
  courseId: string;
  courseName: string;
  editionId?: string;
  editionName?: string;
  projectId?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  courseId,
  courseName,
  editionId,
  editionName,
  projectId,
  onSuccess,
  onError,
}) => {
  const { state, submit, reset } = useEnrollmentForm();

  const [formData, setFormData] = useState<Partial<EnrollmentFormInput>>({
    courseId,
    courseName,
    editionId,
    editionName,
    projectId,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submit(formData as EnrollmentFormInput);
    
    if (result) {
      onSuccess?.(result);
    } else if (state.error) {
      onError?.(state.error);
    }
  };

  // Success state
  if (state.success && state.data) {
    return (
      <div className={successBoxStyles}>
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Iscrizione Inviata!
        </h3>
        <p className="text-green-700 mb-4">
          Grazie {state.data.student.first_name}! La tua richiesta di iscrizione al corso 
          <strong> {courseName}</strong> è stata ricevuta.
        </p>
        <p className="text-sm text-green-600 mb-4">
          Riceverai una email di conferma all'indirizzo {state.data.student.email}
        </p>
        <div className="bg-white rounded-lg p-4 text-left">
          <p className="text-sm text-gray-600">
            <strong>Prossimi passi:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
            <li>Controlla la tua email per le istruzioni</li>
            <li>Prepara i documenti richiesti</li>
            <li>Un nostro operatore ti contatterà entro 48h</li>
          </ul>
        </div>
        <button
          onClick={reset}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Nuova iscrizione
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Corso selezionato */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-600 font-medium">Corso selezionato:</p>
        <p className="text-lg font-bold text-blue-800">{courseName}</p>
        {editionName && (
          <p className="text-sm text-blue-700 mt-1">
            <span className="font-medium">{editionName}</span>
          </p>
        )}
      </div>

      {/* Dati personali */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Nome *</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName || ''}
            onChange={handleChange}
            className={inputStyles}
            placeholder="Mario"
          />
        </div>
        <div>
          <label className={labelStyles}>Cognome *</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName || ''}
            onChange={handleChange}
            className={inputStyles}
            placeholder="Rossi"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            className={inputStyles}
            placeholder="mario.rossi@email.com"
          />
        </div>
        <div>
          <label className={labelStyles}>Telefono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className={inputStyles}
            placeholder="+39 333 1234567"
          />
        </div>
      </div>

      <div>
        <label className={labelStyles}>Codice Fiscale</label>
        <input
          type="text"
          name="fiscalCode"
          maxLength={16}
          value={formData.fiscalCode || ''}
          onChange={handleChange}
          className={`${inputStyles} uppercase`}
          placeholder="RSSMRA80A01H501Z"
        />
      </div>

      <div>
        <label className={labelStyles}>Note o richieste particolari</label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={handleChange}
          className={inputStyles}
          placeholder="Eventuali note..."
        />
      </div>

      {/* Privacy */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted || false}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-600">
            Ho letto e accetto la <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="marketingAccepted"
            checked={formData.marketingAccepted || false}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            Acconsento a ricevere comunicazioni su corsi e novità
          </span>
        </label>
      </div>

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state.loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {state.loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Invio in corso...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Invia Iscrizione
          </>
        )}
      </button>
    </form>
  );
};

// ============================================
// CONTACT FORM (Richiesta Info)
// ============================================

interface ContactFormProps {
  courseInterest?: string;
  courseName?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  courseInterest,
  courseName,
  onSuccess,
  onError,
}) => {
  const { state, submit, reset } = useContactForm();
  
  const [formData, setFormData] = useState<Partial<ContactFormInput>>({
    courseInterest,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-accept privacy on submit (GDPR consent text is displayed in the form)
    const submitData = { ...formData, privacyAccepted: true } as ContactFormInput;
    const result = await submit(submitData);

    if (result) {
      onSuccess?.(result);
    } else if (state.error) {
      onError?.(state.error);
    }
  };

  // Success state
  if (state.success) {
    return (
      <div className={successBoxStyles}>
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Messaggio Inviato!
        </h3>
        <p className="text-green-700 mb-4">
          Grazie per averci contattato. Ti risponderemo il prima possibile.
        </p>
        <button
          onClick={reset}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Invia un altro messaggio
        </button>
      </div>
    );
  }

  const cfInputStyle: React.CSSProperties = {
    width: '100%',
    display: 'block',
    background: 'transparent',
    border: '1.71px solid #E5E7EB',
    borderRadius: '14px',
    padding: '16px',
    fontSize: '16px',
    lineHeight: '24px',
    marginTop: '8px',
    transition: 'all 0.2s',
    outline: 'none',
  };

  const cfLabelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 400,
    color: '#101828',
    display: 'block',
    lineHeight: '24px',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '24px' }}>
      {courseName && (
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-purple-600 font-medium">Richiesta info per:</p>
          <p className="text-lg font-bold text-purple-800">{courseName}</p>
        </div>
      )}

      {/* Nome e Cognome */}
      <div>
        <label style={cfLabelStyle}>Nome e Cognome *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name || ''}
          onChange={handleChange}
          style={cfInputStyle}
          placeholder="Mario Rossi"
        />
      </div>

      {/* Email */}
      <div>
        <label style={cfLabelStyle}>Email *</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email || ''}
          onChange={handleChange}
          style={cfInputStyle}
          placeholder="mario.rossi@email.com"
        />
      </div>

      {/* Telefono */}
      <div>
        <label style={cfLabelStyle}>Telefono</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          style={cfInputStyle}
          placeholder="+39 123 456 7890"
        />
      </div>

      {/* Messaggio */}
      <div>
        <label style={cfLabelStyle}>Messaggio *</label>
        <textarea
          name="message"
          required
          value={formData.message || ''}
          onChange={handleChange}
          style={{ ...cfInputStyle, height: '155px', resize: 'vertical' as const }}
          placeholder="Scrivici qui il tuo messaggio..."
        />
      </div>

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state.loading}
        className="w-full flex items-center justify-center text-white hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{ height: '56px', gap: '8px', fontSize: '16px', lineHeight: '24px', fontWeight: 400, background: 'linear-gradient(90deg, #9810FA 0%, #E60076 100%)', borderRadius: '14px' }}
      >
        {state.loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Invio in corso...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 2.5L9.16667 10.8333"/><path d="M17.5 2.5L11.6667 17.5L9.16667 10.8333L2.5 8.33333L17.5 2.5Z"/></svg>
            Invia Messaggio
          </>
        )}
      </button>
    </form>
  );
};

// ============================================
// PRE-ENROLLMENT FORM (GOL/Master)
// ============================================

interface PreEnrollmentFormProps {
  programId: string;
  programName: string;
  programType: 'master' | 'gol' | 'professionale';
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const PreEnrollmentForm: React.FC<PreEnrollmentFormProps> = ({
  programId,
  programName,
  programType,
  onSuccess,
  onError,
}) => {
  const { state, submit, reset } = usePreEnrollmentForm();
  
  const [formData, setFormData] = useState<Partial<PreEnrollmentFormInput>>({
    programId,
    programName,
    programType,
    privacyAccepted: false,
    marketingAccepted: false,
    dataProcessingAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submit(formData as PreEnrollmentFormInput);
    
    if (result) {
      onSuccess?.(result);
    } else if (state.error) {
      onError?.(state.error);
    }
  };

  // Success state
  if (state.success && state.data) {
    return (
      <div className={successBoxStyles}>
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Pre-iscrizione Inviata!
        </h3>
        <p className="text-green-700 mb-4">
          La tua pre-iscrizione al programma <strong>{programName}</strong> è stata registrata.
        </p>
        
        <div className="bg-white rounded-lg p-4 text-left mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Documenti richiesti:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {state.data.documentsRequired.map((doc, i) => (
              <li key={i}>{doc.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-green-600">
          Riceverai una email con le istruzioni per completare l'iscrizione.
        </p>
        
        <button
          onClick={reset}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Nuova pre-iscrizione
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Programma selezionato */}
      <div className={`rounded-lg p-4 mb-6 ${
        programType === 'gol' ? 'bg-green-50' : 
        programType === 'master' ? 'bg-purple-50' : 'bg-blue-50'
      }`}>
        <p className={`text-sm font-medium ${
          programType === 'gol' ? 'text-green-600' : 
          programType === 'master' ? 'text-purple-600' : 'text-blue-600'
        }`}>
          {programType === 'gol' ? 'Programma GOL' : 
           programType === 'master' ? 'Master' : 'Corso Professionale'}:
        </p>
        <p className={`text-lg font-bold ${
          programType === 'gol' ? 'text-green-800' : 
          programType === 'master' ? 'text-purple-800' : 'text-blue-800'
        }`}>{programName}</p>
      </div>

      {/* Sezione 1: Dati Anagrafici */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">
          Dati Anagrafici
        </legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelStyles}>Nome *</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Cognome *</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelStyles}>Data di Nascita *</label>
            <input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Luogo di Nascita *</label>
            <input
              type="text"
              name="birthPlace"
              required
              value={formData.birthPlace || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelStyles}>Codice Fiscale *</label>
          <input
            type="text"
            name="fiscalCode"
            required
            maxLength={16}
            value={formData.fiscalCode || ''}
            onChange={handleChange}
            className={`${inputStyles} uppercase`}
            placeholder="RSSMRA80A01H501Z"
          />
        </div>
      </fieldset>

      {/* Sezione 2: Contatti */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">
          Contatti
        </legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelStyles}>Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Telefono *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
        </div>
      </fieldset>

      {/* Sezione 3: Residenza */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">
          Residenza
        </legend>
        
        <div className="mt-4">
          <label className={labelStyles}>Indirizzo *</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address || ''}
            onChange={handleChange}
            className={inputStyles}
            placeholder="Via Roma, 1"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="col-span-2">
            <label className={labelStyles}>Città *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city || ''}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Provincia *</label>
            <input
              type="text"
              name="province"
              required
              maxLength={2}
              value={formData.province || ''}
              onChange={handleChange}
              className={`${inputStyles} uppercase`}
              placeholder="PZ"
            />
          </div>
          <div>
            <label className={labelStyles}>CAP *</label>
            <input
              type="text"
              name="zipCode"
              required
              maxLength={5}
              value={formData.zipCode || ''}
              onChange={handleChange}
              className={inputStyles}
              placeholder="85100"
            />
          </div>
        </div>
      </fieldset>

      {/* Sezione 4: Requisiti (solo GOL) */}
      {programType === 'gol' && (
        <fieldset className="border border-green-200 rounded-lg p-4 bg-green-50/50">
          <legend className="text-sm font-semibold text-green-700 px-2">
            Requisiti GOL
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelStyles}>Stato Occupazionale *</label>
              <select
                name="employmentStatus"
                required
                value={formData.employmentStatus || ''}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Seleziona...</option>
                <option value="disoccupato">Disoccupato</option>
                <option value="inoccupato">Inoccupato</option>
                <option value="occupato">Occupato</option>
                <option value="cig">In CIG/CIGS</option>
              </select>
            </div>
            <div>
              <label className={labelStyles}>Titolo di Studio *</label>
              <select
                name="educationLevel"
                required
                value={formData.educationLevel || ''}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Seleziona...</option>
                <option value="diploma">Diploma</option>
                <option value="laurea_triennale">Laurea Triennale</option>
                <option value="laurea_magistrale">Laurea Magistrale</option>
                <option value="altro">Altro</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {/* Come ci hai conosciuto */}
      <div>
        <label className={labelStyles}>Come ci hai conosciuto?</label>
        <select
          name="didYouKnowUs"
          value={formData.didYouKnowUs || ''}
          onChange={handleChange}
          className={inputStyles}
        >
          <option value="">Seleziona...</option>
          <option value="google">Ricerca Google</option>
          <option value="social">Social Media</option>
          <option value="amici">Passaparola</option>
          <option value="centro_impiego">Centro per l'Impiego</option>
          <option value="altro">Altro</option>
        </select>
      </div>

      {/* Privacy */}
      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted || false}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-600">
            Ho letto e accetto la <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="dataProcessingAccepted"
            checked={formData.dataProcessingAccepted || false}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-600">
            Acconsento al trattamento dei dati per finalità formative *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="marketingAccepted"
            checked={formData.marketingAccepted || false}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            Acconsento a ricevere comunicazioni promozionali
          </span>
        </label>
      </div>

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state.loading}
        className={`w-full py-4 px-6 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
          programType === 'gol' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
          programType === 'master' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
          'bg-gradient-to-r from-blue-600 to-cyan-600'
        }`}
      >
        {state.loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Invio in corso...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Invia Pre-iscrizione
          </>
        )}
      </button>
    </form>
  );
};

// ============================================
// QUICK CONTACT FORM (Form compatto per sidebar corsi)
// ============================================

interface QuickContactFormProps {
  courseId?: string;
  courseName?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const QuickContactForm: React.FC<QuickContactFormProps> = ({
  courseId,
  courseName,
  onSuccess,
  onError,
}) => {
  const { state, submit, reset } = useContactForm();

  const [formData, setFormData] = useState<Partial<ContactFormInput>>({
    courseInterest: courseId,
    privacyAccepted: true, // Implicito per form rapido
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepara il subject con info corso
    const subject = courseName
      ? `Domanda su: ${courseName}`
      : 'Richiesta informazioni corso';

    // Componi il messaggio con la provenienza
    const messageWithOrigin = (formData as any).city
      ? `[Provenienza: ${(formData as any).city}]\n\n${formData.message || ''}`
      : formData.message;

    const result = await submit({
      ...formData,
      name: formData.email?.split('@')[0] || 'Utente', // Nome derivato da email
      subject,
      company: (formData as any).city || undefined, // Salva città nel campo company per CRM
      message: messageWithOrigin || '',
      courseInterest: courseId,
      privacyAccepted: true,
    } as ContactFormInput);

    if (result) {
      onSuccess?.(result);
    } else if (state.error) {
      onError?.(state.error);
    }
  };

  // Success state
  if (state.success) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100 shadow-md">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <p className="font-bold text-gray-900 mb-1">Messaggio inviato!</p>
          <p className="text-sm text-gray-600 mb-4">Un nostro consulente ti risponderà al più presto.</p>
          <button
            onClick={reset}
            className="text-xs text-purple-600 font-bold hover:text-purple-700 hover:underline uppercase tracking-wide"
          >
            Invia un altro messaggio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <h3 className="font-bold text-lg text-gray-900">Scrivici</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all placeholder:text-gray-400 shadow-sm"
            placeholder="La tua email"
          />
        </div>

        <div>
          <input
            type="text"
            name="city"
            value={(formData as any).city || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all placeholder:text-gray-400 shadow-sm"
            placeholder="Da dove vieni?"
          />
        </div>

        <div>
          <textarea
            name="message"
            rows={3}
            value={formData.message || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all resize-none placeholder:text-gray-400 shadow-sm"
            placeholder="Cosa vorresti sapere?"
          />
        </div>

        {/* Error message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
        >
          {state.loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Invio...</span>
            </div>
          ) : (
            <>
              Invia Richiesta
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          Rispondiamo solitamente entro 2 ore.
        </p>
      </form>
    </div>
  );
};

// ============================================
// EXPORT
// ============================================

export default {
  EnrollmentForm,
  ContactForm,
  PreEnrollmentForm,
  QuickContactForm,
};
