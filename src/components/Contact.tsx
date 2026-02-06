import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from './EduPlanForms';

interface ContactProps {
  courseInterest?: string;
  courseName?: string;
}

export function Contact({ courseInterest, courseName }: ContactProps) {
  const handleSuccess = (_lead: any) => {
    // Scroll to top per mostrare il messaggio di successo
    window.scrollTo({ top: document.getElementById('contatti')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleError = (_error: string) => {
    // Error handled by the form component
  };

  return (
    <section id="contatti" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            Contattaci
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Iniziamo Insieme
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hai domande sui nostri corsi? Il nostro team è pronto ad aiutarti
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl mb-8">Informazioni di Contatto</h3>
              
              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="mb-1">Indirizzo</div>
                    <p className="text-gray-600">
                      Via della Chimica, 87<br />
                      85100 Potenza
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="mb-1">Telefono</div>
                    <p className="text-gray-600">0971.473968</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="mb-1">Email</div>
                    <p className="text-gray-600">formazione@innform.eu</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="mb-1">Orari di Apertura</div>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p>Lunedì - Venerdì: 9:00 - 13:30 / 15:30 - 19:00</p>
                      <p>Sabato: 10:00 - 13:00</p>
                      <p>Domenica: Chiuso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Integrato con EduPlan */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-2xl">
              <h3 className="text-3xl mb-8">Inviaci un Messaggio</h3>
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