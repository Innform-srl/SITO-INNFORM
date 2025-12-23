import React from 'react';
import { Award, Shield, Target, TrendingUp, CheckCircle, FileText, Download } from 'lucide-react';

export function AboutQuality() {
  return (
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Shield className="text-emerald-300" size={20} />
            <span className="text-sm font-medium">Qualità Certificata</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Certificazione ISO 9001:2015</h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            Eccellenza e monitoraggio costante per garantire servizi formativi di altissimo livello.
          </p>
        </div>
      </section>

      {/* Main Certification Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Sistema di Gestione Qualità
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dal 2024, Innform ha implementato un Sistema di Gestione per la Qualità relativo ai propri servizi di formazione, consulenza e sviluppo delle competenze, ottenendo la Certificazione ISO 9001:2015 da parte dell'Ente Certificatore Dimitto.
              </p>
              
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <Award size={20} />
                  Settori di Attività Certificati (IAF 37)
                </h3>
                <p className="text-emerald-700">
                  Progettazione ed erogazione di servizi di formazione e consulenza, anche attraverso piattaforme digitali, volti a migliorare le performance individuali e organizzative.
                </p>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Ente Certificatore</div>
                  <div className="text-xl font-bold text-gray-900">Dimitto</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Anno Certificazione</div>
                  <div className="text-xl font-bold text-gray-900">2024</div>
                </div>
              </div>
            </div>

            {/* Objectives List */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Obiettivi del Sistema Qualità</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Award,
                    title: "Eccellenza nei Servizi",
                    desc: "Attraverso un approccio rigoroso e metodologie innovative."
                  },
                  {
                    icon: Target,
                    title: "Attenzione al Cliente",
                    desc: "Costruendo partnership solide e durature basate sulla fiducia."
                  },
                  {
                    icon: TrendingUp,
                    title: "Monitoraggio Costante",
                    desc: "Basato su dati oggettivi per il raggiungimento degli obiettivi."
                  },
                  {
                    icon: Shield,
                    title: "Miglioramento Continuo",
                    desc: "Per offrire soluzioni sempre più efficaci e innovative."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Documentazione Ufficiale</h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.innform.eu/wp-content/uploads/2024/07/AG-Certificato_2914-INNFORM-9001.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 w-full max-w-sm flex items-center gap-4 text-left"
            >
              <div className="p-4 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Certificato ISO 9001</h3>
                <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Download size={14} /> Scarica PDF
                </span>
              </div>
            </a>

            <a 
              href="https://www.innform.eu/wp-content/uploads/2024/07/Allegato-A-Politica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 w-full max-w-sm flex items-center gap-4 text-left"
            >
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Politica della Qualità</h3>
                <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Download size={14} /> Scarica PDF
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}