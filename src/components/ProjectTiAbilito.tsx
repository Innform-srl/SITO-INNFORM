import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Users, Target, Calendar, Download,
  MapPin, Mail, Phone, ExternalLink, Globe, Sparkles,
  Brain, Heart, Shield, Award, Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';

export function ProjectTiAbilito() {
  return (
    <div className="bg-white">
      {/* Hero Section - Master Style */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>

        {/* Decorative Blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* Left Column: Text Info */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white shadow-sm text-purple-600 border border-purple-100 flex items-center gap-2">
                   <Sparkles size={16} />
                   Progetto T.I. ABILITO
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-purple-100 text-purple-700 border border-purple-200">
                   Promozione 80
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tecnologia e <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Intelligenza Artificiale</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Per la cura, l'inclusione e la corretta comunicazione della disabilità. Un progetto selezionato da <strong>Con i Bambini</strong> per il contrasto della povertà educativa minorile.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg h-auto shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all">
                  <a href="#alfabetizzazione">Iscriviti al Corso</a>
                </Button>
                <Button variant="outline" className="px-8 py-6 rounded-xl text-lg h-auto border-2 border-gray-300 hover:bg-purple-50 transition-all text-gray-700">
                  <a href="#info">Scopri di più</a>
                </Button>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1597007519573-0575fd4cc96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGFzc2lzdGluZyUyMGRpc2FibGVkJTIwc3R1ZGVudHMlMjBlZHVjYXRpb24lMjB0ZWNobm9sb2d5JTIwYXNzaXN0aXZlJTIwcm9ib3R8ZW58MXx8fHwxNzY1OTg1MDM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Robot educativo utilizzato per supportare studenti con disabilità - Progetto T.I. ABILITO"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                   <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Innovazione Sociale</p>
                      <p className="text-sm text-gray-200">Nuove tecnologie per l'autonomia</p>
                   </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                <div className="bg-green-100 p-2 rounded-full">
                  <Target className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Obiettivo</p>
                  <p className="font-bold text-gray-900">Inclusione 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" id="info">

        {/* Project Details Cards */}
        <div className="grid md:grid-cols-2 gap-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-purple-200 transition-colors"
           >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                 <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Obiettivo Specifico</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                 Sperimentare percorsi inclusivi per <strong>oltre 100 minori con disabilità</strong> in attività didattiche, terapeutiche e ricreative attraverso l'uso delle nuove tecnologie.
              </p>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-purple-600 w-5 h-5 flex-shrink-0" />
                    <span>Integrazione sociale scolastica</span>
                 </li>
                 <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-purple-600 w-5 h-5 flex-shrink-0" />
                    <span>Supporto al progetto di vita</span>
                 </li>
              </ul>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-pink-200 transition-colors"
           >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                 <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Obiettivo Generale</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                 Far acquisire la qualificazione di <strong>"ASSISTENTE ALL'AUTONOMIA E ALLA COMUNICAZIONE (ASACOM)"</strong>, figura professionale chiave per l'assistenza specialistica.
              </p>
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                 <p className="text-sm text-pink-800 font-medium flex items-start gap-2">
                    <Award className="w-4 h-4 mt-1 flex-shrink-0" />
                    Inserimento retribuito nelle attività del progetto al termine del percorso.
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Corso Alfabetizzazione - Highlighted Section */}
        <div id="alfabetizzazione" className="scroll-mt-32">
           <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-2 bg-purple-600 rounded-full"></div>
              <div>
                 <h2 className="text-3xl font-bold text-gray-900">Alfabetizzazione Informatica</h2>
                 <p className="text-purple-600 font-medium flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    Iscrizioni Aperte • Nuovo Bando
                 </p>
              </div>
           </div>

           <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
              <div className="grid lg:grid-cols-3">
                 <div className="lg:col-span-2 p-8 lg:p-12 space-y-8">
                    <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="text-purple-600" />
                          Cosa offre il corso
                       </h3>
                       <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Contenuti</div>
                             <div className="font-semibold text-gray-900">Alfabetizzazione & Tech Assistive</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Durata</div>
                             <div className="font-semibold text-gray-900">20 Ore Complessive</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                             <div className="text-sm text-gray-500 mb-1">Periodo</div>
                             <div className="font-semibold text-gray-900">Febbraio 2026</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                             <div className="text-sm text-green-600 mb-1">Costo</div>
                             <div className="font-bold text-green-700">GRATUITO</div>
                          </div>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="text-purple-600" />
                          Destinatari
                       </h3>
                       <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                          <ul className="space-y-3">
                             <li className="flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></div>
                                <span className="text-gray-700">Massimo 15 famiglie residenti nei Comuni del Marmo Platano Melandro.</span>
                             </li>
                             <li className="flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></div>
                                <span className="text-gray-700">Famiglie con almeno un figlio con disabilità (partecipante o futuro partecipante).</span>
                             </li>
                             <li className="flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></div>
                                <span className="text-gray-700 font-medium">È richiesta la presenza di almeno un genitore.</span>
                             </li>
                          </ul>
                       </div>
                    </div>
                 </div>

                 <div className="bg-purple-900 text-white p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                       <h3 className="text-2xl font-bold mb-6">Candidati Ora</h3>
                       <div className="space-y-6">
                          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                             <p className="text-purple-200 text-xs font-bold uppercase mb-1">Scadenza</p>
                             <p className="text-2xl font-bold">16 Gen 2026</p>
                          </div>

                          <div className="space-y-3">
                             <p className="font-medium">Documenti necessari:</p>
                             <a
                               href="https://drive.google.com/open?id=1tyLPZl08PoLo5-tRr_xje8ZekGPxGoid&usp=drive_fs"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors group cursor-pointer"
                             >
                                <span className="flex items-center gap-2 text-sm">
                                   <Download size={16} /> Bando Completo
                                </span>
                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                             </a>
                             <a
                               href="https://drive.google.com/open?id=1zVeQIaKV-Mj9hy3YMH_E51qyHwtDyCL5&usp=drive_fs"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors group cursor-pointer"
                             >
                                <span className="flex items-center gap-2 text-sm">
                                   <Download size={16} /> Modulo Domanda
                                </span>
                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                             </a>
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-purple-800">
                       <p className="text-sm text-purple-200 mb-2">Invia la domanda a:</p>
                       <a href="mailto:tiabilito@gmail.com" className="text-lg font-bold hover:text-purple-300 transition-colors">tiabilito@gmail.com</a>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Corso ASACOM - Secondary/Closed Section */}
        <div id="asacom">
           <div className="flex items-center gap-4 mb-8 opacity-60">
              <div className="h-10 w-2 bg-gray-400 rounded-full"></div>
              <div>
                 <h2 className="text-3xl font-bold text-gray-500">Corso ASACOM</h2>
                 <p className="text-gray-400 font-medium flex items-center gap-2">
                    <CheckCircle size={14} />
                    Edizione Conclusa
                 </p>
              </div>
           </div>

           <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <p className="text-gray-600 italic">
                       Le selezioni per questo corso sono terminate. Le informazioni qui sotto sono mantenute a titolo di archivio per consultazione.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-2xl shadow-sm">
                          <Clock className="text-gray-400 mb-2" />
                          <div className="text-2xl font-bold text-gray-700">600</div>
                          <div className="text-sm text-gray-500">Ore Totali</div>
                       </div>
                       <div className="bg-white p-4 rounded-2xl shadow-sm">
                          <Users className="text-gray-400 mb-2" />
                          <div className="text-2xl font-bold text-gray-700">10</div>
                          <div className="text-sm text-gray-500">Partecipanti</div>
                       </div>
                    </div>

                    <div>
                       <h4 className="font-bold text-gray-700 mb-3">Requisiti Richiesti</h4>
                       <ul className="text-gray-500 space-y-2 text-sm">
                          <li>• Diploma di scuola secondaria di secondo grado</li>
                          <li>• Stato di disoccupazione/inoccupazione</li>
                          <li>• Residenza in Basilicata (aree interne)</li>
                       </ul>
                    </div>
                 </div>

                 <div className="space-y-6 opacity-70">
                    <h4 className="font-bold text-gray-700">Programma Didattico Svolto</h4>
                    <div className="space-y-2">
                       {["Sicurezza sul lavoro", "Assistenza autonomia (Disabilità cognitiva)", "Assistenza autonomia (Disabilità sensoriale)", "Laboratori socio-educativi", "Gestione emergenze"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                             <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                {i + 1}
                             </div>
                             <span className="text-gray-600 text-sm">{item}</span>
                          </div>
                       ))}
                    </div>
                    <Button variant="outline" disabled className="w-full">Bando Chiuso</Button>
                 </div>
              </div>
           </div>
        </div>

        {/* News Grid */}
        <div>
           <h2 className="text-3xl font-bold text-gray-900 mb-8">Ultime Novità</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  date: "16 Dic 2025",
                  tag: "Nuovo Bando",
                  title: "Online il Bando T.I. ABILITO: aperte le selezioni",
                  link: "https://www.innform.eu/online-il-bando-t-i-abilito-aperte-le-selezioni-per-il-corso-di-alfabetizzazione-informatica/"
                },
                {
                  date: "9 Nov 2024",
                  tag: "Avviso",
                  title: "Pubblicato elenco convocazioni corso ASACOM",
                  link: "https://www.innform.eu/pubblicata-lelenco-delle-convocazioni-per-il-giorno-14-novembrei-al-corso-asacom-progetto-ti-abilito/"
                },
                {
                  date: "1 Nov 2024",
                  tag: "Graduatoria",
                  title: "Pubblicata la graduatoria ammessi ASACOM",
                  link: "https://www.innform.eu/3938-2/"
                }
              ].map((news, i) => (
                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-gray-400">{news.date}</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg font-medium">{news.tag}</span>
                   </div>
                   <h3 className="font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {news.title}
                   </h3>
                   <div className="flex items-center text-purple-600 text-sm font-medium">
                      Leggi tutto <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </div>
                </a>
              ))}
           </div>
        </div>

        {/* Contact Footer Block */}
        <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

           <div className="relative z-10 grid lg:grid-cols-2 gap-12">
              <div>
                 <h2 className="text-3xl font-bold mb-6">Contatti & Info</h2>
                 <p className="text-gray-400 mb-8 max-w-md">
                    Hai domande sul progetto o sui corsi? Il team di Innform è a tua disposizione per fornirti tutte le informazioni necessarie.
                 </p>

                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Phone className="text-purple-400" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Telefono</p>
                          <p className="font-medium">0971 473968</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Mail className="text-purple-400" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Email Innform</p>
                          <a href="mailto:formazione@innform.eu" className="font-medium hover:text-purple-400">formazione@innform.eu</a>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <MapPin className="text-purple-400" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Sede</p>
                          <p className="font-medium">Via della Chimica, 87 - Potenza</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                 <div className="flex items-center gap-3 mb-6">
                    <Globe className="text-purple-400" />
                    <span className="font-bold">Partner & Finanziatori</span>
                 </div>
                 <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Il progetto è stato selezionato da <strong>Con i Bambini</strong> nell'ambito del Fondo per il contrasto della povertà educativa minorile. Innform è partner strategico per la formazione.
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {["Disabilità", "Inclusione", "Tech", "Formazione", "Basilicata"].map((tag) => (
                       <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-purple-300 border border-white/5">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
