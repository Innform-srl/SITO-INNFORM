import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Briefcase, Target, BookOpen, Eye } from 'lucide-react';

export function Programs() {
  const programs = [
    {
      id: 'master',
      title: 'Master',
      description: 'Alta formazione specialistica per laureati: Analisi Ambientali, Editoria, Safety Management, Interior Design.',
      color: 'from-pink-600 to-purple-600',
      icon: GraduationCap,
      features: ['Titoli Riconosciuti', 'Stage Garantiti', 'Docenti Esperti'],
    },
    {
      id: 'gol',
      title: 'Programma GOL',
      description: 'Corsi gratuiti per il reinserimento lavorativo: Turismo, Infanzia, Tornitura, Sicurezza H2S.',
      color: 'from-blue-600 to-cyan-500',
      icon: Target,
      features: ['Gratuito 100%', 'Indennità Frequenza', 'Supporto Lavoro'],
    },
    {
      id: 'specializzazione',
      title: 'Corsi di Specializzazione',
      description: 'Formazione avanzata per professionisti: Accessibilità turistica, Comunicazione inclusiva, Esperienze multisensoriali.',
      color: 'from-teal-600 to-cyan-500',
      icon: Eye,
      features: ['Attestato Specializzazione', 'Laboratori Esperienziali', 'Competenze Avanzate'],
    },
  ];

  return (
    <section id="programmi" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 border-8 border-purple-600 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 border-8 border-pink-600 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            Programmi Formativi
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Scegli il Tuo Percorso
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Percorsi di eccellenza per laureati e programmi finanziati per l'inserimento lavorativo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Link
                key={index}
                to={`/programmi/${program.id}`}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative p-10 space-y-8 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${program.color} group-hover:bg-white transition-all duration-500 shadow-lg`}>
                    <Icon className="text-white group-hover:text-purple-600 transition-colors" size={40} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-white transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-lg text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 group-hover:border-white/20">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${program.color} group-hover:bg-white`}></div>
                        <span className="text-gray-700 group-hover:text-white transition-colors font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-purple-600 group-hover:text-white transition-colors pt-4 font-bold">
                    <span>Scopri il programma</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${program.color} opacity-10 rounded-bl-full`}></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}