import React from 'react';
import { Linkedin, Facebook, Instagram, Mail, Phone, MapPin, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">In</span>
                <span className="bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">n</span>
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">form</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Formazione professionale di eccellenza nel settore
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://linkedin.com/company/innform-innovazione-formazione" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://facebook.com/innform.eu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com/innform_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Corsi */}
            <div>
              <h4 className="text-lg mb-6 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Corsi
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#corsi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Master Tecnici</a></li>
                <li><a href="#corsi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Corsi Professionali</a></li>
                <li><a href="#certificazioni" className="hover:text-white hover:translate-x-1 inline-block transition-all">Certificazioni</a></li>
                <li><a href="#corsi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Alta Formazione</a></li>
              </ul>
            </div>

            {/* Programmi */}
            <div>
              <h4 className="text-lg mb-6 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Programmi
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#programmi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Progetto TI.ABILITO</a></li>
                <li><a href="#programmi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Progetto Segni</a></li>
                <li><a href="#programmi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Programma GOL</a></li>
                <li><a href="#chi-siamo" className="hover:text-white hover:translate-x-1 inline-block transition-all">Chi Siamo</a></li>
              </ul>
            </div>

            {/* Contatti */}
            <div>
              <h4 className="text-lg mb-6 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Contatti
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <Mail size={18} className="mt-1 text-purple-400" />
                  <span>formazione@innform.eu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-1 text-pink-400" />
                  <span>0971.473968</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 text-blue-400" />
                  <span>
                    Via della Chimica, 87<br />
                    85100 Potenza
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Accreditations */}
          <div className="border-t border-white/10 py-8">
            <h5 className="text-center text-gray-400 text-sm mb-6 uppercase tracking-wider">Certificazioni e Accreditamenti</h5>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-green-400" />
                <span>Accreditamento Regione Basilicata (dal 2007)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-400" />
                <span>Pekit Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-yellow-400" />
                <span>Qualità Certificata ISO</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-purple-400" />
                <span>Referente Fondo Interprofessionale Fonarcom</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Innform. Tutti i diritti riservati.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-white transition-colors">Termini e Condizioni</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}