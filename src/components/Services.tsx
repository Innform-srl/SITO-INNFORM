import React from 'react';
import { Building2, User } from 'lucide-react';

export function Services() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            I Nostri Servizi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluzioni formative su misura per aziende e privati
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Business Services */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Servizi alle Imprese</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Formazione aziendale in Basilicata per rendere le imprese più competitive.
              Offriamo corsi obbligatori sicurezza lavoro D.Lgs. 81/08, certificazioni informatiche PEKIT
              e formazione finanziata tramite Fondo Fonarcom. Consulenza personalizzata per identificare
              i fabbisogni formativi e sviluppare piani di crescita professionale mirati.
            </p>
          </div>

          {/* Private Services */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <User size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Servizi ai Privati</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Corsi gratuiti per disoccupati tramite Programma GOL e qualifiche professionali riconosciute
              dalla Regione Basilicata. Dai master post-laurea ai corsi di specializzazione, offriamo
              percorsi formativi per entrare nel mercato del lavoro in modo competitivo con stage garantito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
