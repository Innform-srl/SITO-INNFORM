import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Target, Calendar, Download,
  MapPin, Mail, Phone, Globe, Sparkles,
  Heart, Shield, Award, Clock, Baby, Home, BookOpen, Smartphone, GraduationCap, PartyPopper, CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';

export function ProjectSegni() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-rose-50 opacity-60"></div>

        {/* Decorative Blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* Left Column: Text Info */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-bold bg-white shadow-sm flex items-center gap-2"
                  style={{ color: '#e11d48', border: '1px solid #fecdd3' }}
                >
                   <Heart size={16} style={{ color: '#e11d48' }} />
                   Progetto SE.G.NI.
                </span>
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}
                >
                   Con i Bambini
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Servizi Educativi e <span style={{ color: '#ea580c' }}>Genitorialità</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Sperimentazione di un <strong>nido privato interaziendale</strong> per la conciliazione famiglia-lavoro e il contrasto alla povertà educativa nei comuni di Tito, Picerno, Bella, Ruoti e Satriano.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="#nido"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-medium transition-all"
                  style={{ backgroundColor: '#e11d48', color: 'white', boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)' }}
                >
                  Scopri il Nido
                </a>
                <a
                  href="#attivita"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-medium transition-all"
                  style={{ backgroundColor: 'white', color: '#374151', border: '2px solid #d1d5db' }}
                >
                  Tutte le attività
                </a>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/segni-hero.jpg"
                  alt="Bambini al nido durante attività di lettura"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                   <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Il Piccolo Nido</p>
                      <p className="text-sm text-gray-200">Crescere insieme</p>
                   </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: '#ffedd5' }}>
                  <Baby size={24} style={{ color: '#ea580c' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Nuovi Posti</p>
                  <p className="font-bold text-gray-900">20 Bambini 0-3 anni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" id="info">

        {/* Intro / Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-orange-200 transition-colors"
           >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#ffedd5' }}
              >
                 <Home size={24} style={{ color: '#ea580c' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Primo Nido Interaziendale</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                 Situato nell'area industriale di <strong>Tito Scalo</strong>, al servizio di 150 aziende e delle famiglie dei comuni limitrofi.
              </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-rose-200 transition-colors"
           >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#ffe4e6' }}
              >
                 <GraduationCap size={24} style={{ color: '#e11d48' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Formazione Donne</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                 Corso di qualifica per <strong>10 donne</strong> come "Tecnico del Sistema Educativo", con priorità alle madri per il reinserimento lavorativo.
              </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-purple-200 transition-colors"
           >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#f3e8ff' }}
              >
                 <MapPin size={24} style={{ color: '#9333ea' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">5 Comuni Coinvolti</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                 Una rete territoriale che comprende <strong>Bella, Picerno, Ruoti, Tito e Satriano di Lucania</strong>.
              </p>
           </motion.div>
        </div>

        {/* Nido Interaziendale - Highlighted Section */}
        <div id="nido" className="scroll-mt-32">
           <div className="flex items-center gap-4 mb-8">
              <div className="rounded-full" style={{ height: '40px', width: '8px', backgroundColor: '#f97316' }}></div>
              <div>
                 <h2 className="text-3xl font-bold text-gray-900">Il Nido Interaziendale</h2>
                 <p className="font-medium flex items-center gap-2" style={{ color: '#ea580c' }}>
                    <Sparkles size={16} style={{ color: '#ea580c' }} />
                    Innovazione in Basilicata
                 </p>
              </div>
           </div>

           <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '1px solid #fed7aa' }}>
              <div className="grid lg:grid-cols-2">
                 <div className="p-8 lg:p-12 space-y-8 order-2 lg:order-1">
                    <div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Un servizio su misura per le famiglie
                       </h3>
                       <p className="text-gray-600 mb-6">
                          Il progetto attiva 20 nuovi posti per bambini da <strong>3 mesi a 3 anni</strong>, con l'obiettivo di supportare la conciliazione dei tempi di vita e di lavoro delle famiglie, in particolare delle mamme lavoratrici.
                       </p>

                       <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                             <div className="flex items-center gap-2 mb-2">
                                <Users size={18} style={{ color: '#ea580c' }} />
                                <span className="font-bold text-gray-900">Destinatari</span>
                             </div>
                             <p className="text-sm text-gray-600">Dipendenti delle 150 aziende dell'area industriale e residenti nei comuni partner.</p>
                          </div>
                          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                             <div className="flex items-center gap-2 mb-2">
                                <Shield size={18} style={{ color: '#ea580c' }} />
                                <span className="font-bold text-gray-900">Inclusività</span>
                             </div>
                             <p className="text-sm text-gray-600">Rette parametrate al reddito familiare per garantire l'accesso a tutti.</p>
                          </div>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                       <h4 className="font-bold text-gray-900 mb-3">Obiettivi Specifici:</h4>
                       <ul className="space-y-2">
                          {[
                            "Conciliazione tempo famiglia-lavoro",
                            "Accesso ai servizi educativi anche per famiglie fragili",
                            "Integrazione sociale e supporto alla genitorialità"
                          ].map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#f97316' }} />
                                <span>{item}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="relative h-64 lg:h-auto order-1 lg:order-2" style={{ minHeight: '400px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBraWRzJTIwdG95c3xlbnwxfHx8fDE3NjU5ODcyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Aula colorata del nido Il Piccolo Nido con giochi educativi per bambini 0-3 anni"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Altre Attività - Grid */}
        <div id="attivita">
           <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Le Attività del Progetto</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                   icon: Users,
                   bgColor: '#dbeafe',
                   iconColor: '#2563eb',
                   title: "Laboratori Genitori-Bimbi",
                   desc: "Attività pomeridiane per la fascia 0-3 anni, focalizzate sulla relazione genitoriale e lo sviluppo armonico del bambino."
                },
                {
                   icon: PartyPopper,
                   bgColor: '#dcfce7',
                   iconColor: '#16a34a',
                   title: "Laboratori Ludico-Ricreativi",
                   desc: "Attività educative ispirate al metodo Montessori per bambini 4-6 anni, con priorità a situazioni di vulnerabilità."
                },
                {
                   icon: BookOpen,
                   bgColor: '#fef9c3',
                   iconColor: '#ca8a04',
                   title: "Biblioteca per l'Infanzia",
                   desc: "Un nuovo spazio culturale inaugurato presso il nido, dedicato alla lettura e alla scoperta per i più piccoli."
                },
                {
                   icon: Smartphone,
                   bgColor: '#f3e8ff',
                   iconColor: '#9333ea',
                   title: "App Orientamento",
                   desc: "Strumento digitale per informare le famiglie sui servizi del territorio e offrire consulenze psicologiche."
                },
                {
                   icon: GraduationCap,
                   bgColor: '#ffe4e6',
                   iconColor: '#e11d48',
                   title: "Corso Qualifica Professionale",
                   desc: "Formazione per 10 donne come 'Tecnico del Sistema Educativo', riconosciuta dalla Regione Basilicata."
                },
                {
                   icon: Target,
                   bgColor: '#cffafe',
                   iconColor: '#0891b2',
                   title: "Comunità Educante",
                   desc: "Focus group, Open Space Technology e coinvolgimento attivo di genitori, professionisti e cittadini."
                }
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                   <div
                     className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: card.bgColor }}
                   >
                      <card.icon size={24} style={{ color: card.iconColor }} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Evento Finale Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl">
          <div className="absolute inset-0">
            <img
               src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2NTk4NzQ1MXww&ixlib=rb-4.1.0&q=80&w=1080"
               alt="Famiglie e bambini durante l'evento finale del Progetto Segni a Satriano di Lucania"
               loading="lazy"
               decoding="async"
               className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-purple-900/90 mix-blend-multiply" />
          </div>

          <div className="relative p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center rounded-full bg-rose-500/20 px-3 py-1 text-sm font-medium text-rose-300 ring-1 ring-inset ring-rose-500/30">
                   Evento Conclusivo
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">La Festa del Progetto SE.G.NI.</h2>
                <p className="text-lg text-gray-300">
                   Una giornata di festa, testimonianze e attività per bambini per celebrare i risultati raggiunti insieme alla comunità.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <div className="flex items-center gap-3">
                      <Calendar className="text-rose-400" />
                      <span className="font-semibold">27 Giugno 2025</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Clock className="text-rose-400" />
                      <span className="font-semibold">Ore 17:00</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <MapPin className="text-rose-400" />
                      <span className="font-semibold">Picerno (PZ)</span>
                   </div>
                </div>
             </div>

             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 min-w-[300px]">
                <h3 className="font-bold text-xl mb-4 border-b border-white/20 pb-2">Programma</h3>
                <ul className="space-y-3 text-sm text-gray-200">
                   <li className="flex gap-3">
                      <span className="font-bold text-rose-300">17:00</span>
                      <span>Presentazione risultati e testimonianze</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="font-bold text-rose-300">18:00</span>
                      <span>Giochi e attività per bambini</span>
                   </li>
                </ul>
             </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-3xl p-8 lg:p-12" style={{ backgroundColor: 'rgba(255, 237, 213, 0.5)', border: '1px solid #fed7aa' }}>
           <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">La voce dei protagonisti</h2>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                 <div
                   className="absolute font-serif leading-none"
                   style={{ top: '-16px', left: '24px', fontSize: '60px', color: '#fdba74' }}
                 >"</div>
                 <p className="text-gray-600 italic mb-4 relative z-10 pt-4">
                    Grazie a questo progetto ho trovato non solo un supporto per mio figlio, ma anche una rete di amiche e professionisti che mi hanno aiutata a crescere come genitore e come donna.
                 </p>
                 <div className="flex items-center gap-3">
                    <div
                      className="rounded-full flex items-center justify-center font-bold"
                      style={{ width: '40px', height: '40px', backgroundColor: '#ffedd5', color: '#ea580c' }}
                    >M</div>
                    <div>
                       <p className="font-bold text-gray-900">Una Mamma</p>
                       <p className="text-xs text-gray-500">Beneficiaria del Nido</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                 <div
                   className="absolute font-serif leading-none"
                   style={{ top: '-16px', left: '24px', fontSize: '60px', color: '#fda4af' }}
                 >"</div>
                 <p className="text-gray-600 italic mb-4 relative z-10 pt-4">
                    Ho imparato tanto, non solo a livello di competenze, ma soprattutto a credere in me stessa e a lavorare in gruppo. È un'esperienza che porterò sempre con me.
                 </p>
                 <div className="flex items-center gap-3">
                    <div
                      className="rounded-full flex items-center justify-center font-bold"
                      style={{ width: '40px', height: '40px', backgroundColor: '#ffe4e6', color: '#e11d48' }}
                    >A</div>
                    <div>
                       <p className="font-bold text-gray-900">Un'Allieva</p>
                       <p className="text-xs text-gray-500">Corso di Qualifica</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Timeline & Blog Grid */}
        <div className="grid lg:grid-cols-3 gap-16">
           {/* Timeline Column */}
           <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-10">Il Percorso</h2>
              <div className="relative pl-2">
                 {[
                   { date: "Giu 2022", title: "Avvio Progetto", desc: "Presentazione ufficiale a Tito." },
                   { date: "Ott 2022", title: "Apertura Nido", desc: "Inaugurazione primo nido interaziendale." },
                   { date: "Nov 2023", title: "Nuova Biblioteca", desc: "Spazio lettura per l'infanzia." },
                   { date: "Nov 2023", title: "Formazione", desc: "Avvio corso qualifica donne." },
                   { date: "Giu 2025", title: "Evento Finale", desc: "Chiusura attività e festa." }
                 ].map((item, i, arr) => (
                    <div key={i} className="flex pb-12 last:pb-0" style={{ gap: '24px' }}>
                       {/* Timeline dot and line */}
                       <div className="flex flex-col items-center">
                          <div
                            className="rounded-full flex-shrink-0"
                            style={{
                              width: '14px',
                              height: '14px',
                              backgroundColor: '#f43f5e',
                              marginTop: '2px'
                            }}
                          ></div>
                          {i < arr.length - 1 && (
                            <div
                              className="flex-1"
                              style={{
                                width: '2px',
                                backgroundColor: '#e5e7eb',
                                marginTop: '8px'
                              }}
                            ></div>
                          )}
                       </div>
                       {/* Content */}
                       <div className="flex-1">
                         <span style={{ color: '#e11d48', fontSize: '15px', fontWeight: 700 }} className="block mb-3">{item.date}</span>
                         <h4 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h4>
                         <p className="text-base text-gray-500 leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* News Column */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dal Blog di Progetto</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                   {
                     date: "7 Dic 2023",
                     title: "I SEGNI…dei laboratori!",
                     link: "https://percorsiconibambini.it/progetto-segni/2023/12/07/i-segnidei-laboratori-attivita-educative-dedicate-ai-bambini-e-alle-bambine-tra-i-4-e-i-6-anni/"
                   },
                   {
                     date: "15 Nov 2023",
                     title: "Illuminiamo il Futuro: Nuova Biblioteca",
                     link: "https://percorsiconibambini.it/progetto-segni/2023/11/15/illuminiamo-il-futuro-dei-bambini-la-nuova-biblioteca-per-linfanzia/"
                   },
                   {
                     date: "3 Nov 2023",
                     title: "Donne e Lavoro: Opportunità formativa",
                     link: "https://percorsiconibambini.it/progetto-segni/2023/11/03/donne-e-lavoro-un-opportunita-formativa-nel-modo-dellinfanzia/"
                   },
                   {
                     date: "3 Ott 2022",
                     title: "Inaugurato il primo nido interaziendale!",
                     link: "https://percorsiconibambini.it/progetto-segni/2022/10/03/inaugurato-il-primo-nido-interaziendale-in-basilicata/"
                   }
                 ].map((news, i) => (
                   <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-xs font-bold text-gray-400">{news.date}</span>
                         <ArrowRight size={14} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                         {news.title}
                      </h3>
                   </a>
                 ))}
              </div>
              <div className="mt-6 text-right">
                 <a href="https://percorsiconibambini.it/progetto-segni/" target="_blank" rel="noopener noreferrer" className="text-rose-600 font-medium hover:underline text-sm">
                    Leggi tutte le notizie su Percorsi Con i Bambini →
                 </a>
              </div>
           </div>
        </div>

        {/* Contact Footer Block */}
        <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

           <div className="relative z-10 grid lg:grid-cols-2 gap-12">
              <div>
                 <h2 className="text-3xl font-bold mb-6">Contatti</h2>

                 <div className="space-y-6">
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold mb-2">Soggetto Responsabile</p>
                       <p className="font-bold text-xl">Associazione Il Piccolo Nido</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                             <Phone className="text-orange-400" size={20} />
                          </div>
                          <div>
                             <p className="text-xs text-gray-500 uppercase font-bold">Info Telefono</p>
                             <p className="font-medium">0971 473968</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                             <Mail className="text-orange-400" size={20} />
                          </div>
                          <div>
                             <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                             <a href="mailto:formazione@innform.eu" className="font-medium hover:text-orange-400">formazione@innform.eu</a>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                 <div className="flex items-center gap-3 mb-6">
                    <Globe className="text-orange-400" />
                    <span className="font-bold">Partner di Progetto</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                       <strong className="text-white block mb-1">Enti Locali</strong>
                       <ul className="space-y-1">
                          <li>Comune di Picerno</li>
                          <li>Comune di Bella</li>
                          <li>Città di Tito</li>
                          <li>Comune di Ruoti</li>
                       </ul>
                    </div>
                    <div>
                       <strong className="text-white block mb-1">Operativi</strong>
                       <ul className="space-y-1">
                          <li>Innform srl</li>
                          <li>Stella Azzurra</li>
                          <li>IC "G. Pascoli"</li>
                          <li>A.Ge.Pi. Picerno</li>
                       </ul>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                       Finanziato da <strong>Con i Bambini</strong> - Fondo per il contrasto della Povertà Educativa Minorile
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
