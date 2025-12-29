import React from 'react';
import { Eye, Target, Handshake, Scale, ShieldCheck, CheckCircle } from 'lucide-react';
import { SEOHead } from './SEOHead';

export function AboutVision() {
  return (
    <>
      <SEOHead
        title="Visione e Missione - I Nostri Valori"
        description="La visione e missione di Innform: eccellenza nella formazione professionale in Basilicata. Valori di trasparenza, legalità e innovazione guidano il nostro impegno."
        url="/chi-siamo/visione-missione"
      />
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Visione e Missione</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            I valori che guidano il nostro impegno quotidiano nella formazione.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Vision */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-blue-50 relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Eye size={120} className="text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="text-blue-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">La Nostra Visione</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  La Innform è un'impresa dinamica che sostiene la formazione di qualità, lo sviluppo delle competenze e le opportunità di lavoro per le persone. Crediamo nel potenziale umano come motore di crescita per l'intero territorio.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-purple-50 relative overflow-hidden group hover:border-purple-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={120} className="text-purple-600" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="text-purple-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">La Nostra Missione</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Il Centro di formazione offre soluzioni formative innovative, anche in e-learning, con modalità efficaci e integrate, per le persone che hanno voglia di crescere e di acquisire, rafforzare e aggiornare competenze professionali.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">I Nostri Valori</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Operiamo nel mondo della formazione seguendo principi etici fondamentali che guidano ogni nostra decisione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Trasparenza */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-cyan-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center">
                  <Handshake className="text-cyan-600" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Trasparenza</h3>
              <p className="text-gray-600 text-center text-lg">
                "Relazioni chiare e trasparenti con tutti i nostri stakeholder: studenti, partner e istituzioni."
              </p>
            </div>

            {/* Legalità */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-indigo-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Scale className="text-indigo-600" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Legalità</h3>
              <p className="text-gray-600 text-center text-lg">
                "Rispetto rigoroso della legislazione vigente in ogni aspetto della gestione aziendale."
              </p>
            </div>

            {/* Onestà */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-emerald-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <ShieldCheck className="text-emerald-600" size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Onestà</h3>
              <p className="text-gray-600 text-center text-lg">
                "Integrità e correttezza nello sviluppo di tutte le attività formative e professionali."
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
    </>
  );
}