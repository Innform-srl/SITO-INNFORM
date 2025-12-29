import React from 'react';
import { MapPin, Phone, Mail, Clock, Train, Car, Navigation } from 'lucide-react';
import { SEOHead } from './SEOHead';

export function AboutLocation() {
  return (
    <>
      <SEOHead
        title="Dove Siamo - Sede Innform Potenza"
        description="Innform si trova in Via della Chimica 87, Potenza (Basilicata). Orari apertura: Lun-Ven 9:00-13:30 e 15:30-19:00, Sab 10:00-13:00. Tel: 0971.473968"
        url="/chi-siamo/dove-siamo"
      />
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Dove Ci Troviamo</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Vieni a trovarci nella nostra sede operativa a Potenza.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Info Side */}
            <div className="space-y-12">
              
              {/* Main Address Card */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600">
                    <MapPin size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sede Principale</h2>
                    <p className="text-xl text-gray-600">
                      Via della Chimica, 87<br />
                      85100 Potenza (PZ)<br />
                      Basilicata, Italia
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-gray-700">
                    <Phone className="text-gray-400" />
                    <span className="font-semibold">0971.473968</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-700">
                    <Mail className="text-gray-400" />
                    <span className="font-semibold">formazione@innform.eu</span>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Orari di Apertura</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-gray-600">Lunedì - Venerdì</span>
                    <span className="font-semibold text-gray-900 text-right">09:00 - 13:30<br/>15:30 - 19:00</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-gray-600">Sabato</span>
                    <span className="font-semibold text-gray-900">10:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Domenica</span>
                    <span className="font-semibold text-red-500">Chiuso</span>
                  </div>
                </div>
              </div>

              {/* Directions */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4 text-gray-900 font-bold">
                    <Train className="text-purple-600" />
                    In Treno
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Stazione centrale di Potenza</li>
                    <li>• A piedi verso Via della Chimica 87</li>
                    <li>• Tempo: 5 minuti</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4 text-gray-900 font-bold">
                    <Car className="text-purple-600" />
                    In Auto
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Uscita Potenza centro</li>
                    <li>• Direzione Via della Chimica 87</li>
                    <li>• Tempo: 5 minuti</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Map Side */}
            <div className="h-full min-h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-xl border border-gray-200 relative">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3018.677685606622!2d15.798485376543592!3d40.63972697140505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1338e3f607c3970b%3A0x2658872015383921!2sVia%20della%20Chimica%2C%2087%2C%2085100%20Potenza%20PZ!5e0!3m2!1sit!2sit!4v1715421234567!5m2!1sit!2sit" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Innform"
                className="absolute inset-0"
              ></iframe>
              <div className="absolute bottom-6 right-6">
                <a 
                  href="https://maps.google.com/?q=Via+della+Chimica+87,+85100+Potenza,+Italia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <Navigation size={18} />
                  Ottieni Indicazioni
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    </>
  );
}