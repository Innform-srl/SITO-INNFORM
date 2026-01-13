import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Donna che lavora al laptop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-3">Benvenuto in Innform</h2>
            <p className="text-gray-200 text-sm leading-relaxed">
              La piattaforma per la tua crescita professionale. Accedi ai corsi, gestisci le tue iscrizioni e scopri nuove opportunità.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 px-8 py-12 lg:px-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bentornato!</h1>
            <p className="text-gray-600">Inserisci le tue credenziali per accedere.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-normal text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="mario@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-normal text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/password-dimenticata"
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Password dimenticata?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-lg"
            >
              Accedi
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <span className="text-gray-600">Non hai ancora un account? </span>
            <Link
              to="/registrati"
              className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
            >
              Registrati ora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
