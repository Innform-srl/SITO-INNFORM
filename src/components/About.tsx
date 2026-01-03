import React from 'react';
import { Users, Award, BookOpen, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Users, value: '673+', label: 'Studenti Formati', color: 'from-purple-600 to-purple-400' },
    { icon: Award, value: '50+', label: 'Corsi Certificati', color: 'from-pink-600 to-pink-400' },
    { icon: BookOpen, value: '18+', label: 'Anni di Esperienza', color: 'from-blue-600 to-blue-400' },
    { icon: TrendingUp, value: '95%', label: 'Tasso di Successo', color: 'from-green-600 to-green-400' },
  ];

  const features = [
    'Docenti certificati e qualificati',
    'Laboratori tecnologicamente avanzati',
    'Certificazioni riconosciute',
    'Supporto post-formazione',
    'Stage e tirocini garantiti',
    'Network di aziende partner',
    'Referente Fondo Interprofessionale Fonarcom'
  ];

  return (
    <section id="chi-siamo" className="py-24 bg-gradient-to-b from-white via-purple-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            <Sparkles size={18} />
            <span>Chi Siamo</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Eccellenza nella Formazione
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative text-center space-y-3">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} group-hover:bg-white transition-all duration-500`}>
                    <Icon className="text-white group-hover:text-purple-600 transition-colors" size={28} />
                  </div>
                  <div className="text-4xl group-hover:text-white transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl">
                La Tua Crescita Professionale è la Nostra Missione
              </h3>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Innform è un centro di formazione professionale accreditato in Regione Basilicata dal 2007, certificato ISO 9001:2015. Progetta e gestisce master e corsi di alta formazione per laureati, formazione professionale con rilascio di qualifiche riconosciute per disoccupati tramite Programma GOL, e formazione continua rivolta a lavoratori e imprenditori.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Come referente del Fondo Fonarcom, offriamo formazione finanziata per le aziende. Implementiamo soluzioni formative per lo sviluppo delle competenze, accompagnando ogni persona nel mondo del lavoro con stage garantito e placement lavorativo.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mt-1">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#contatti"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span>Unisciti a Noi</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/programmi/gol"
                className="inline-flex items-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transform hover:scale-105 transition-all duration-300"
              >
                <span>Scopri Programma GOL</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right - Visual Element */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12">
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20"></div>
              
              <div className="relative space-y-6">
                {/* Quote */}
                <div className="text-6xl text-purple-600 opacity-20">"</div>
                <blockquote className="text-2xl text-gray-800 leading-relaxed">
                  Investire nella formazione significa investire nel futuro. 
                  Ogni studente è un professionista in crescita.
                </blockquote>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"></div>
                  <div>
                    <div>Team Innform</div>
                    <div className="text-sm text-gray-600">Centro Formazione</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}