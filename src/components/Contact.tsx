import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronDown, Facebook, Instagram, Linkedin, MessageCircle, Headphones } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContactForm, ContactFormInput } from '../hooks/useEduPlanForms';

interface ContactProps {
  courseInterest?: string;
  courseName?: string;
}

const faqItems = [
  {
    question: 'Come posso iscrivermi ad un corso?',
    answer: 'Puoi iscriverti compilando il modulo in questa pagina, chiamandoci al numero 0971.473968 o visitandoci in sede. Ti guideremo nella scelta del percorso più adatto alle tue esigenze.'
  },
  {
    question: 'I corsi del Programma GOL sono davvero gratuiti?',
    answer: 'Sì, i corsi GOL sono completamente gratuiti per i beneficiari, in quanto finanziati dal PNRR. È necessario possedere determinati requisiti: essere disoccupati o percettori di ammortizzatori sociali.'
  },
  {
    question: 'Rilasciate attestati e certificazioni riconosciute?',
    answer: 'Certamente. In qualità di ente accreditato dalla Regione Basilicata dal 2007, tutti i nostri corsi rilasciano attestati riconosciuti. Siamo anche centro d\'esame Pekit Expert per le certificazioni informatiche.'
  },
  {
    question: 'È possibile seguire i corsi online?',
    answer: 'Alcuni dei nostri percorsi prevedono modalità blended (parte in presenza, parte online). Contattaci per verificare la disponibilità della modalità online per il corso che ti interessa.'
  },
  {
    question: 'Quanto durano mediamente i corsi?',
    answer: 'La durata varia in base alla tipologia: i corsi singoli vanno da 40 a 200 ore, mentre i Master e i percorsi GOL possono durare da 200 a 600 ore. Ogni scheda corso riporta la durata specifica.'
  }
];

export function Contact({ courseInterest }: ContactProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { state, submit, reset } = useContactForm();
  const [formData, setFormData] = useState<Partial<ContactFormInput>>({
    courseInterest,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const { ref: heroRef, revealed: heroRevealed } = useScrollReveal();
  const { ref: cardsRef, revealed: cardsRevealed } = useScrollReveal();
  const { ref: leftRef, revealed: leftRevealed } = useScrollReveal();
  const { ref: rightRef, revealed: rightRevealed } = useScrollReveal();
  const { ref: faqRef, revealed: faqRevealed } = useScrollReveal();
  const { ref: ctaRef, revealed: ctaRevealed } = useScrollReveal();

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
    const submitData = { ...formData, privacyAccepted: formData.privacyAccepted || false } as ContactFormInput;
    await submit(submitData);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-36 lg:pt-44 pb-20 lg:pb-28 bg-slate-50 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 mix-blend-multiply">
          <div className="absolute bg-purple-200/40 rounded-full blur-3xl opacity-70 animate-pulse" style={{ width: '35%', height: '55%', top: '-10%', left: '-5%', animationDuration: '8s' }}></div>
          <div className="absolute bg-pink-200/40 rounded-full blur-3xl opacity-60 animate-pulse" style={{ width: '30%', height: '45%', top: '10%', right: '-10%', animationDuration: '10s' }}></div>
          <div className="absolute bg-blue-200/30 rounded-full blur-3xl opacity-60 animate-pulse" style={{ width: '40%', height: '50%', bottom: '-15%', left: '30%', animationDuration: '12s' }}></div>
        </div>

        <div
          ref={heroRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal-up ${heroRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-purple-100 shadow-sm mb-6">
            <MessageCircle className="text-purple-600" size={16} />
            <span className="text-sm font-bold text-purple-700 uppercase tracking-wide">Contatti</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Parliamo del tuo{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              futuro
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
            Il nostro team è pronto ad ascoltarti. Che tu stia cercando un corso,
            informazioni sul Programma GOL o semplicemente un consiglio, siamo qui per te.
          </p>
        </div>
      </section>

      {/* Quick Contacts Strip */}
      <section className="-mt-10 relative z-20">
        <div
          ref={cardsRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-stagger ${cardsRevealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phone */}
            <a href="tel:0971473968" className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="text-rose-600" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Chiamaci</div>
                <div className="text-sm font-semibold text-gray-800 truncate">0971.473968</div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:formazione@innform.eu" className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="text-blue-600" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Scrivici</div>
                <div className="text-sm font-semibold text-gray-800 truncate">formazione@innform.eu</div>
              </div>
            </a>

            {/* Location */}
            <a href="https://goo.gl/maps/your-location" target="_blank" rel="noopener noreferrer" className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-emerald-600" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Vieni a trovarci</div>
                <div className="text-sm font-semibold text-gray-800 truncate">Via della Chimica, 87 — Potenza</div>
              </div>
            </a>

            {/* Hours */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock className="text-amber-600" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Orari</div>
                <div className="text-sm font-semibold text-gray-800 truncate">Lun–Ven 9:00–19:00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Map + Form */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Left Column: Map + Info */}
            <div
              ref={leftRef}
              className={`flex flex-col gap-8 reveal-left ${leftRevealed ? 'revealed' : ''}`}
            >
              {/* Map */}
              <div className="overflow-hidden bg-gray-200" style={{ borderRadius: '24px', outline: '0.57px solid #F3F4F6', boxShadow: '0px 8px 10px -6px rgba(229, 231, 235, 0.60), 0px 20px 25px -5px rgba(229, 231, 235, 0.60)', height: '500px' }}>
                <iframe
                  src="https://www.google.com/maps?q=Via+della+Chimica+87,+85100+Potenza+PZ,+Italy&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Innform Location"
                  className="bg-gray-100"
                ></iframe>
              </div>

              {/* Sede Operativa */}
              <div className="flex flex-col" style={{ background: '#F9FAFB', borderRadius: '16px', outline: '0.57px solid #F3F4F6', padding: '24px 24px 24px 24px', gap: '32px' }}>
                <h3 className="flex items-center gap-2 font-bold" style={{ fontSize: '20px', lineHeight: '28px', color: '#101828' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8.33334 10H11.6667M8.33334 6.66663H11.6667M11.6667 17.5V15C11.6667 14.558 11.4911 14.1341 11.1785 13.8215C10.866 13.509 10.442 13.3334 10 13.3334C9.55798 13.3334 9.13406 13.509 8.8215 13.8215C8.50894 14.1341 8.33334 14.558 8.33334 15V17.5M4.99999 8.33337H3.33332C2.8913 8.33337 2.46737 8.50897 2.15481 8.82153C1.84225 9.13409 1.66666 9.55801 1.66666 10V15.8334C1.66666 16.2754 1.84225 16.6993 2.15481 17.0119C2.46737 17.3244 2.8913 17.5 3.33332 17.5H16.6667C17.1087 17.5 17.5326 17.3244 17.8452 17.0119C18.1577 16.6993 18.3333 16.2754 18.3333 15.8334V7.50004C18.3333 7.05801 18.1577 6.63409 17.8452 6.32153C17.5326 6.00897 17.1087 5.83337 16.6667 5.83337H15M5 17.5V4.16667C5 3.72464 5.17559 3.30072 5.48816 2.98816C5.80072 2.67559 6.22464 2.5 6.66667 2.5H13.3333C13.7754 2.5 14.1993 2.67559 14.5118 2.98816C14.8244 3.30072 15 3.72464 15 4.16667V17.5" stroke="#9810FA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sede Operativa
                </h3>

                {/* Address */}
                <div className="flex gap-3">
                  <MapPin style={{ color: '#AD46FF' }} className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <div style={{ fontSize: '16px', lineHeight: '24px', color: '#1E2939' }}>Via della Chimica, 87</div>
                    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#6A7282' }}>85100 Potenza (PZ), Italia</div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-3">
                  <Clock style={{ color: '#AD46FF' }} className="flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex flex-col gap-1">
                    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#1E2939' }}>Orari di apertura</div>
                    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}>Lunedì – Venerdì: <strong>9:00 – 13:30 / 15:30 – 19:00</strong></div>
                    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}>Sabato: <strong>10:00 – 13:00</strong></div>
                    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#99A1AF' }}>Domenica: Chiuso</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="text-white" style={{ background: 'linear-gradient(135deg, #101828 0%, #3C0366 100%)', borderRadius: '16px', padding: '24px 24px 24px 24px' }}>
                <h3 className="flex items-center gap-2 font-bold mb-4" style={{ fontSize: '18px', lineHeight: '28px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79566 11.25 9.00002 11.25H4.50002C3.70437 11.25 2.9413 11.5661 2.37869 12.1287C1.81609 12.6913 1.50002 13.4544 1.50002 14.25V15.75M12 2.34595C12.6433 2.51272 13.2131 2.8884 13.6198 3.41399C14.0265 3.93959 14.2472 4.58536 14.2472 5.24995C14.2472 5.91453 14.0265 6.5603 13.6198 7.0859C13.2131 7.6115 12.6433 7.98717 12 8.15395M16.5 15.75V14.25C16.4995 13.5853 16.2783 12.9396 15.871 12.4143C15.4638 11.8889 14.8936 11.5137 14.25 11.3475M6.75002 8.25C8.40687 8.25 9.75002 6.90685 9.75002 5.25C9.75002 3.59315 8.40687 2.25 6.75002 2.25C5.09316 2.25 3.75002 3.59315 3.75002 5.25C3.75002 6.90685 5.09316 8.25 6.75002 8.25Z" stroke="#DAB2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Seguici sui Social
                </h3>
                <p className="mb-4" style={{ fontSize: '14px', lineHeight: '20px', color: '#99A1AF' }}>
                  Resta aggiornato su nuovi corsi, eventi e opportunità.
                </p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/innform.eu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20" style={{ width: '44px', height: '44px', background: 'rgba(255, 255, 255, 0.10)', borderRadius: '14px' }}>
                    <Facebook size={20} />
                  </a>
                  <a href="https://instagram.com/innform_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20" style={{ width: '44px', height: '44px', background: 'rgba(255, 255, 255, 0.10)', borderRadius: '14px' }}>
                    <Instagram size={20} />
                  </a>
                  <a href="https://linkedin.com/company/innform-innovazione-formazione" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20" style={{ width: '44px', height: '44px', background: 'rgba(255, 255, 255, 0.10)', borderRadius: '14px' }}>
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div
              ref={rightRef}
              className={`relative reveal-right ${rightRevealed ? 'revealed' : ''}`}
            >
              {/* Glow decorativo */}
              <div className="absolute -z-10 inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, #9810FA, #E60076)', opacity: 0.10, filter: 'blur(80px)' }}></div>

              <div className="relative h-full flex flex-col bg-white rounded-3xl" style={{ padding: '40px', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '30px', lineHeight: '36px', fontWeight: 400, color: '#101828' }}>Inviaci un Messaggio</h2>
                </div>

                <div className="flex-1">
                  {state.success ? (
                    <div className="text-center py-12">
                      <div className="text-green-600 text-5xl mb-4">✓</div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Messaggio Inviato!</h3>
                      <p className="text-green-700 mb-4">Grazie per averci contattato. Ti risponderemo il prima possibile.</p>
                      <button onClick={reset} className="text-purple-600 hover:text-purple-800 font-medium">Invia un altro messaggio</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '24px' }}>
                      {/* Nome e Cognome */}
                      <div>
                        <label style={{ fontSize: '16px', fontWeight: 400, color: '#101828', display: 'block', lineHeight: '24px' }}>Nome e Cognome *</label>
                        <input type="text" name="name" required value={formData.name || ''} onChange={handleChange} placeholder="Mario Rossi"
                          style={{ width: '100%', display: 'block', background: 'transparent', border: '1.71px solid #E5E7EB', borderRadius: '14px', padding: '16px', fontSize: '16px', lineHeight: '24px', marginTop: '8px', outline: 'none' }} />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ fontSize: '16px', fontWeight: 400, color: '#101828', display: 'block', lineHeight: '24px' }}>Email *</label>
                        <input type="email" name="email" required value={formData.email || ''} onChange={handleChange} placeholder="mario.rossi@email.com"
                          style={{ width: '100%', display: 'block', background: 'transparent', border: '1.71px solid #E5E7EB', borderRadius: '14px', padding: '16px', fontSize: '16px', lineHeight: '24px', marginTop: '8px', outline: 'none' }} />
                      </div>

                      {/* Telefono */}
                      <div>
                        <label style={{ fontSize: '16px', fontWeight: 400, color: '#101828', display: 'block', lineHeight: '24px' }}>Telefono</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+39 123 456 7890"
                          style={{ width: '100%', display: 'block', background: 'transparent', border: '1.71px solid #E5E7EB', borderRadius: '14px', padding: '16px', fontSize: '16px', lineHeight: '24px', marginTop: '8px', outline: 'none' }} />
                      </div>

                      {/* Messaggio */}
                      <div>
                        <label style={{ fontSize: '16px', fontWeight: 400, color: '#101828', display: 'block', lineHeight: '24px' }}>Messaggio *</label>
                        <textarea name="message" required value={formData.message || ''} onChange={handleChange} placeholder="Scrivici qui il tuo messaggio..."
                          style={{ width: '100%', display: 'block', background: 'transparent', border: '1.71px solid #E5E7EB', borderRadius: '14px', padding: '16px', fontSize: '16px', lineHeight: '24px', marginTop: '8px', height: '155px', resize: 'vertical', outline: 'none' }} />
                      </div>

                      {/* Error */}
                      {state.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-600 text-sm">{state.error}</p>
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div
          ref={faqRef}
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up ${faqRevealed ? 'revealed' : ''}`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-purple-100 px-4 py-2 rounded-full shadow-sm mb-4">
              <Headphones className="text-purple-600" size={16} />
              <span className="text-sm font-bold text-purple-700 uppercase tracking-wide">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Domande Frequenti</h2>
            <p className="text-gray-500">Le risposte alle domande che ci vengono poste più spesso.</p>
          </div>

          <div className="bg-white overflow-hidden" style={{ borderRadius: '24px', border: '0.57px solid #E5E7EB', boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.04), 0px 10px 15px -3px rgba(0, 0, 0, 0.06)' }}>
            {faqItems.map((item, index) => (
              <div key={index} style={{ borderBottom: index < faqItems.length - 1 ? '0.57px solid rgba(0, 0, 0, 0.1)' : 'none' }}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ height: '80px', padding: '0 24px' }}
                >
                  <span className={`font-semibold pr-4 transition-colors duration-300 ${openFaqIndex === index ? 'text-purple-700' : 'text-gray-800 group-hover:text-purple-600'}`} style={{ fontSize: '16px', lineHeight: '24px' }}>
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaqIndex === index
                      ? 'bg-purple-600 text-white rotate-180'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                  }`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaqIndex === index ? '200px' : '0px',
                    opacity: openFaqIndex === index ? 1 : 0,
                  }}
                >
                  <div style={{ padding: '0 24px 24px 24px', fontSize: '15px', lineHeight: '24px', color: '#6A7282' }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900"></div>
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-purple-950/70 to-gray-900/80"></div>

        <div
          ref={ctaRef}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 reveal-up ${ctaRevealed ? 'revealed' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Preferisci parlare di persona?
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Vieni a trovarci nella nostra sede di Potenza. Saremo felici di accoglierti e
            consigliarti il percorso formativo ideale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:0971473968"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-purple-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Phone size={20} />
              Chiama ora
            </a>
            <a
              href="https://goo.gl/maps/your-location"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <MapPin size={20} />
              Indicazioni Stradali
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
