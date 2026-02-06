/**
 * Configurazione EduPlan per il sito Innform.eu
 * Questo file inizializza il servizio EduPlan con le variabili d'ambiente
 */

import { configureEduPlan } from '../services/eduplan-api';

export const initEduPlan = () => {
  const mode = (import.meta.env.VITE_EDUPLAN_MODE as 'localStorage' | 'supabase' | 'api') || 'localStorage';

  configureEduPlan({
    mode,
    apiBaseUrl: import.meta.env.VITE_EDUPLAN_API_URL || 'https://api.eduplan.innform.eu',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    debug: import.meta.env.VITE_DEBUG === 'true',
  });
};

export default initEduPlan;
