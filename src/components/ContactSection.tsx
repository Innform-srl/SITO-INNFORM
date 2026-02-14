import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from './EduPlanForms';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ContactSectionProps {
  courseInterest?: string;
  courseName?: string;
}

export function ContactSection({ courseInterest, courseName }: ContactSectionProps) {
  const { ref: headerRef, revealed: headerRevealed } = useScrollReveal();
  const { ref: leftRef, revealed: leftRevealed } = useScrollReveal();
  const { ref: rightRef, revealed: rightRevealed } = useScrollReveal();

  const handleSuccess = (_lead: any) => {
    window.scrollTo({ top: document.getElementById('contatti')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleError = (_error: string) => {
    // Error handled by the form component
  };

  return (
    <section id="contatti" className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)' }}>
      {/* Background Decoration */}
      <div className="absolute inset-0" style={{ opacity: 0.05 }}>
        <div className="absolute rounded-full" style={{ width: '384px', height: '384px', top: 0, right: 0, background: '#9810FA', filter: 'blur(128px)' }}></div>
        <div className="absolute rounded-full" style={{ width: '384px', height: '384px', bottom: 0, left: 0, background: '#E60076', filter: 'blur(128px)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center reveal-up ${headerRevealed ? 'revealed' : ''}`}
          style={{ marginBottom: '64px' }}
        >
          <div
            className="inline-flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(90deg, #9810FA, #E60076)', borderRadius: '9999px', padding: '8px 24px', marginBottom: '16px', fontSize: '16px', lineHeight: '24px' }}
          >
            Contattaci
          </div>
          <h2
            className="bg-clip-text text-transparent"
            style={{ fontSize: '60px', lineHeight: '60px', fontWeight: 400, backgroundImage: 'linear-gradient(90deg, #101828 0%, #59168B 50%, #861043 100%)', marginBottom: '24px' }}
          >
            Iniziamo Insieme
          </h2>
          <p style={{ fontSize: '20px', lineHeight: '28px', color: '#4A5565', maxWidth: '672px', margin: '0 auto' }}>
            Hai domande sui nostri corsi? Il nostro team è pronto ad aiutarti
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2" style={{ gap: '48px' }}>
          {/* Left Column: Contact Info */}
          <div
            ref={leftRef}
            className={`reveal-left ${leftRevealed ? 'revealed' : ''}`}
          >
            <h3 style={{ fontSize: '30px', lineHeight: '36px', fontWeight: 400, color: '#101828', marginBottom: '32px' }}>
              Informazioni di Contatto
            </h3>

            <div className="flex flex-col" style={{ gap: '24px' }}>
              {/* Address Card */}
              <div
                className="flex items-start bg-white"
                style={{ gap: '16px', padding: '24px', borderRadius: '16px', boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #9810FA, #C27AFF)' }}
                >
                  <MapPin className="text-white" size={24} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#101828' }}>Indirizzo</div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#4A5565', marginTop: '4px' }}>
                    Via della Chimica, 87<br />
                    85100 Potenza
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div
                className="flex items-start bg-white"
                style={{ gap: '16px', padding: '24px', borderRadius: '16px', boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #E60076, #FB64B6)' }}
                >
                  <Phone className="text-white" size={24} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#101828' }}>Telefono</div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#4A5565', marginTop: '4px' }}>0971.473968</div>
                </div>
              </div>

              {/* Email Card */}
              <div
                className="flex items-start bg-white"
                style={{ gap: '16px', padding: '24px', borderRadius: '16px', boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #155DFC, #51A2FF)' }}
                >
                  <Mail className="text-white" size={24} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#101828' }}>Email</div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#4A5565', marginTop: '4px' }}>formazione@innform.eu</div>
                </div>
              </div>

              {/* Hours Card */}
              <div
                className="flex items-start bg-white"
                style={{ gap: '16px', padding: '24px', borderRadius: '16px', boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #00A63E, #05DF72)' }}
                >
                  <Clock className="text-white" size={24} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', lineHeight: '24px', color: '#101828' }}>Orari di Apertura</div>
                  <div className="flex flex-col" style={{ marginTop: '4px', gap: '4px' }}>
                    <span style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}>Lunedì - Venerdì: 9:00 - 13:30 / 15:30 - 19:00</span>
                    <span style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}>Sabato: 10:00 - 13:00</span>
                    <span style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}>Domenica: Chiuso</span>
                  </div>
                </div>
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

            <div className="relative bg-white" style={{ padding: '40px', borderRadius: '24px', boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <h3 style={{ fontSize: '30px', lineHeight: '36px', fontWeight: 400, color: '#101828', marginBottom: '32px' }}>
                Inviaci un Messaggio
              </h3>
              <ContactForm
                courseInterest={courseInterest}
                courseName={courseName}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
