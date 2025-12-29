import React from 'react';
import { Users, Calendar, Award, CheckCircle2, FileText, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from './SEOHead';

export function AboutOverview() {
  return (
    <>
      <SEOHead
        title="Chi Siamo - Ente di Formazione Accreditato"
        description="Innform è un centro di formazione professionale accreditato in Basilicata dal 2007. Oltre 18 anni di esperienza, 673+ studenti formati, 50+ corsi certificati."
        url="/chi-siamo/panoramica"
      />
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Chi Siamo</h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Da oltre 18 anni, il punto di riferimento per la formazione in Basilicata.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Società accreditata in Regione Basilicata dal 2007
              </h2>
              <div className="text-gray-600 space-y-4 text-lg leading-relaxed">
                <p>
                  Innform progetta e gestisce master e corsi di alta formazione per laureati, formazione professionale anche con rilascio di qualifiche per disoccupati, formazione continua rivolta a lavoratori e imprenditori, di aziende regionali e non solo.
                </p>
                <p>
                  Implementiamo "soluzioni formative" finalizzate allo sviluppo delle competenze e del potenziale delle persone, per accompagnarle nel mondo del lavoro e consolidare la loro professionalità.
                </p>
                <p>
                  È ampio il ventaglio di offerta formativa rivolta ai giovani, nell'ambito della promozione delle politiche attive, compresa l'attivazione di tirocini formativi.
                </p>
                <div className="p-6 bg-purple-50 rounded-2xl border-l-4 border-purple-600">
                  <p className="italic text-purple-900 font-medium">
                    "Oltre agli avvisi pubblici promossi dalla Regione Basilicata, Innform progetta e gestisce progetti complessi ed integrati su bandi pubblicati da Ministeri e Fondazioni."
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="text-pink-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">673+</div>
                <div className="text-gray-600 font-medium">Studenti Formati</div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar className="text-purple-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">2007</div>
                <div className="text-gray-600 font-medium">Anno Accreditamento</div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 sm:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Briefcase className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Partner Fondo Fonarcom</h3>
                </div>
                <p className="text-gray-600">
                  Soggetto referente per il Fondo Interprofessionale Fonarcom, offriamo formazione gratuita costruita interamente sulle esigenze aziendali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-wide uppercase">Cosa Facciamo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">I Nostri Servizi Principali</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Master e corsi di alta formazione per laureati",
              "Formazione professionale con rilascio qualifiche",
              "Formazione continua per lavoratori e imprenditori",
              "Tirocini formativi per giovani",
              "Progetti di inclusione per persone svantaggiate",
              "Formazione gratuita per imprese (Fonarcom)"
            ].map((service, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={24} />
                <span className="text-lg text-gray-700 font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trasparenza Aziendale</h2>
          <div className="flex justify-center">
            <a 
              href="https://www.innform.eu/wp-content/uploads/2024/07/Allegato-B-Organigramma.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-purple-600 text-purple-700 px-8 py-4 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold shadow-lg"
            >
              <FileText size={24} />
              Scarica Organigramma Aziendale
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}