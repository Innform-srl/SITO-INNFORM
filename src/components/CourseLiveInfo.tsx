/**
 * Componenti per visualizzare informazioni live dei corsi
 * Badge dinamici, posti disponibili, countdown deadline
 *
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

import React from 'react';
import { Clock, Users, AlertTriangle, CheckCircle, Flame, Star, Calendar, Layers, MapPin } from 'lucide-react';
import { CoursePublicData, CourseBadges, CourseEdition } from '../types/courses-public';
import { getOccupancyPercent, formatDateIT } from '../services/public-courses-api';

// ============================================
// COURSE BADGES - Badge dinamici
// ============================================

interface CourseBadgesProps {
  badges: CourseBadges;
  availableSpots?: number;
  daysUntilStart?: number | null;
  totalEditions?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function CourseBadgesDisplay({
  badges,
  availableSpots,
  daysUntilStart,
  totalEditions,
  className = '',
  size = 'md',
}: CourseBadgesProps) {
  // Badge uniformi: stesso padding, altezza e font-size per tutti
  const baseClass = size === 'sm'
    ? 'px-3 py-1.5 text-xs rounded-lg'
    : 'px-4 py-2 text-sm rounded-xl';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* NUOVO */}
      {badges.new_course && (
        <span className={`${baseClass} bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-sm`}>
          <Star size={iconSize} />
          Nuovo
        </span>
      )}

      {/* PIU' EDIZIONI (v3.0) */}
      {badges.has_multiple_editions && totalEditions && totalEditions > 1 && (
        <span
          className={`${baseClass} text-white font-bold flex items-center gap-1.5 shadow-sm`}
          style={{ backgroundColor: '#6366f1' }}
        >
          <Layers size={iconSize} />
          {totalEditions} edizioni
        </span>
      )}

      {/* ESAURITO */}
      {badges.sold_out && (
        <span
          className={`${baseClass} text-white font-bold flex items-center gap-1.5 shadow-sm`}
          style={{ backgroundColor: '#ef4444' }}
        >
          <AlertTriangle size={iconSize} />
          Esaurito
        </span>
      )}

      {/* ULTIMI POSTI - Non mostrare se già iniziato */}
      {badges.last_spots && !badges.sold_out && !badges.already_started && (
        <span
          className={`${baseClass} text-white font-bold flex items-center gap-1.5 shadow-sm animate-pulse`}
          style={{ backgroundColor: '#f97316' }}
        >
          <Flame size={iconSize} />
          {availableSpots !== undefined ? `Ultimi ${availableSpots} posti` : 'Ultimi posti'}
        </span>
      )}

      {/* ISCRIZIONI APERTE */}
      {badges.enrollments_open && !badges.sold_out && (
        <span className={`${baseClass} bg-green-500 text-white font-bold flex items-center gap-1.5 shadow-sm`}>
          <CheckCircle size={iconSize} />
          Iscrizioni aperte
        </span>
      )}

      {/* INIZIA PRESTO */}
      {badges.starting_soon && daysUntilStart !== null && daysUntilStart !== undefined && (
        <span className={`${baseClass} bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-sm`}>
          <Calendar size={iconSize} />
          Inizia tra {daysUntilStart} giorni
        </span>
      )}

      {/* DEADLINE VICINA */}
      {badges.deadline_soon && !badges.sold_out && (
        <span
          className={`${baseClass} text-white font-bold flex items-center gap-1.5 shadow-sm`}
          style={{ backgroundColor: '#f59e0b' }}
        >
          <Clock size={iconSize} />
          Deadline vicina
        </span>
      )}

      {/* GIÀ INIZIATO (v3.7) - Rimosso: mostrato solo nel selettore edizioni */}
    </div>
  );
}

// ============================================
// COURSE AVAILABILITY - Barra posti disponibili
// ============================================

interface CourseAvailabilityProps {
  course: CoursePublicData;
  showText?: boolean;
  className?: string;
}

export function CourseAvailability({
  course,
  showText = true,
  className = '',
}: CourseAvailabilityProps) {
  const occupancyPercent = getOccupancyPercent(course);

  // Colore barra in base alla disponibilita' (usando colori inline per compatibilita')
  let barColorHex = '#22c55e'; // green-500
  if (occupancyPercent >= 90) {
    barColorHex = '#ef4444'; // red-500
  } else if (occupancyPercent >= 70) {
    barColorHex = '#f97316'; // orange-500
  } else if (occupancyPercent >= 50) {
    barColorHex = '#eab308'; // yellow-500
  }

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${occupancyPercent}%`, backgroundColor: barColorHex }}
        />
      </div>

      {/* Testo */}
      {showText && (
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Users size={14} />
            {course.available_spots} posti disponibili
          </span>
          <span className="text-gray-400">
            su {course.max_participants}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// COUNTDOWN DEADLINE
// ============================================

interface DeadlineCountdownProps {
  daysUntilDeadline: number | null;
  deadlineDate?: string | null;
  className?: string;
}

export function DeadlineCountdown({
  daysUntilDeadline,
  deadlineDate,
  className = '',
}: DeadlineCountdownProps) {
  if (daysUntilDeadline === null || daysUntilDeadline < 0) {
    return null;
  }

  // Stili inline per compatibilita' con Tailwind CSS bundle
  let containerStyle: React.CSSProperties = {
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#bfdbfe', // blue-200
    color: '#1e40af', // blue-800
  };
  let iconStyle: React.CSSProperties = { color: '#3b82f6' }; // blue-500
  let IconComponent = Clock;

  if (daysUntilDeadline === 0) {
    containerStyle = {
      backgroundColor: '#fef2f2', // red-50
      borderColor: '#fca5a5', // red-300
      color: '#991b1b', // red-800
    };
    iconStyle = { color: '#ef4444' }; // red-500
    IconComponent = AlertTriangle;
  } else if (daysUntilDeadline <= 3) {
    containerStyle = {
      backgroundColor: '#fff7ed', // orange-50
      borderColor: '#fdba74', // orange-300
      color: '#9a3412', // orange-800
    };
    iconStyle = { color: '#f97316' }; // orange-500
    IconComponent = Flame;
  } else if (daysUntilDeadline <= 7) {
    containerStyle = {
      backgroundColor: '#fffbeb', // amber-50
      borderColor: '#fcd34d', // amber-200
      color: '#92400e', // amber-800
    };
    iconStyle = { color: '#f59e0b' }; // amber-500
    IconComponent = Clock;
  }

  return (
    <div
      className={`border-l-4 px-4 py-3 rounded-r-lg ${className}`}
      style={containerStyle}
    >
      <div className="flex items-center gap-2">
        <IconComponent style={iconStyle} size={18} />
        <div>
          {daysUntilDeadline === 0 ? (
            <span className="font-bold">Ultimo giorno per iscriversi!</span>
          ) : (
            <>
              <span className="font-bold">{daysUntilDeadline} giorni</span>
              <span className="ml-1">alla scadenza iscrizioni</span>
            </>
          )}
          {deadlineDate && (
            <div className="text-xs opacity-75 mt-0.5">
              Scadenza: {formatDateIT(deadlineDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COURSE INFO CARD - Card informativa completa
// ============================================

interface CourseInfoCardProps {
  course: CoursePublicData;
  className?: string;
}

export function CourseInfoCard({ course, className = '' }: CourseInfoCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Badge section */}
      <div className="px-6 pt-6">
        <CourseBadgesDisplay
          badges={course.badges}
          availableSpots={course.available_spots}
          daysUntilStart={course.days_until_start}
        />
      </div>

      {/* Availability */}
      <div className="px-6 py-4">
        <CourseAvailability course={course} />
      </div>

      {/* Deadline countdown */}
      {course.days_until_deadline !== null && course.days_until_deadline >= 0 && (
        <div className="px-6 pb-4">
          <DeadlineCountdown
            daysUntilDeadline={course.days_until_deadline}
            deadlineDate={course.enrollment_deadline}
          />
        </div>
      )}

      {/* Info rapide */}
      <div className="px-6 pb-6 space-y-3">
        {course.start_date && (
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar size={18} className="text-purple-500" />
            <span>Inizio: <strong>{formatDateIT(course.start_date)}</strong></span>
          </div>
        )}
        {course.teacher && (
          <div className="flex items-center gap-3 text-gray-600">
            <Users size={18} className="text-blue-500" />
            <span>Docente: <strong>{course.teacher.name}</strong></span>
          </div>
        )}
        {course.duration_hours > 0 && (
          <div className="flex items-center gap-3 text-gray-600">
            <Clock size={18} className="text-green-500" />
            <span>Durata: <strong>{course.duration_hours} ore</strong></span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        {course.is_enrollments_open ? (
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
            Iscriviti Ora
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed"
          >
            {course.badges.sold_out ? 'Corso Esaurito' : 'Iscrizioni Chiuse'}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// LIVE INDICATOR - Indicatore aggiornamento live
// ============================================

interface LiveIndicatorProps {
  lastUpdated: Date | null;
  loading?: boolean;
  className?: string;
}

export function LiveIndicator({ lastUpdated, loading, className = '' }: LiveIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 text-xs text-gray-400 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
      {loading ? (
        <span>Aggiornamento...</span>
      ) : lastUpdated ? (
        <span>Aggiornato alle {lastUpdated.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
      ) : (
        <span>Dati live</span>
      )}
    </div>
  );
}

// ============================================
// EDITIONS LIST - Lista edizioni corso (v3.4 - Tab UI)
// ============================================

interface EditionsListProps {
  editions: CourseEdition[];
  selectedEditionId?: string;
  onSelectEdition?: (edition: CourseEdition) => void;
  className?: string;
}

export function EditionsList({ editions, selectedEditionId, onSelectEdition, className = '' }: EditionsListProps) {
  // Filtra e ordina edizioni: escludi quelle già iniziate, ordina per deadline
  const sortedEditions = React.useMemo(() => {
    if (!editions || editions.length === 0) return [];

    // Filtra via le edizioni già iniziate - mostra solo quelle con data futura
    const availableEditions = editions.filter(ed => !ed.badges.already_started);

    return availableEditions.sort((a, b) => {
      // Le edizioni esaurite vanno alla fine
      if (a.badges.sold_out && !b.badges.sold_out) return 1;
      if (!a.badges.sold_out && b.badges.sold_out) return -1;

      // Ordina per deadline (chi scade prima viene prima)
      const deadlineA = a.enrollment_deadline ? new Date(a.enrollment_deadline).getTime() : Infinity;
      const deadlineB = b.enrollment_deadline ? new Date(b.enrollment_deadline).getTime() : Infinity;
      if (deadlineA !== deadlineB) return deadlineA - deadlineB;

      // Se stessa deadline, ordina per data inizio
      const startA = new Date(a.start_date).getTime();
      const startB = new Date(b.start_date).getTime();
      return startA - startB;
    });
  }, [editions]);

  // Edizione selezionata (default: prima disponibile)
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(null);

  // Determina l'edizione effettivamente selezionata (esclude esaurite)
  const effectiveSelectedId = selectedEditionId || internalSelectedId ||
    (sortedEditions.find(ed => !ed.badges.sold_out && ed.is_enrollments_open)?.id) ||
    sortedEditions[0]?.id;

  const selectedEdition = sortedEditions.find(ed => ed.id === effectiveSelectedId);

  // Notifica il parent quando cambia la selezione
  React.useEffect(() => {
    if (selectedEdition && onSelectEdition && !selectedEditionId) {
      onSelectEdition(selectedEdition);
    }
  }, []);

  if (!editions || editions.length === 0) {
    return null;
  }

  const handleSelectEdition = (edition: CourseEdition) => {
    // Non selezionare edizioni esaurite
    if (edition.badges.sold_out) return;
    setInternalSelectedId(edition.id);
    onSelectEdition?.(edition);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <h4 className="font-bold text-gray-900 flex items-center gap-2">
        <Layers size={18} style={{ color: '#6366f1' }} />
        Scegli la tua edizione
      </h4>

      {/* Tab Navigation - Layout verticale compatto */}
      <div className="flex flex-col gap-2">
        {sortedEditions.map((edition, index) => {
          const isSelected = edition.id === effectiveSelectedId;
          const isDisabled = edition.badges.sold_out;

          // Colori alternati per le righe non selezionate
          const rowColors = [
            { bg: '#f0f9ff', border: '#bae6fd' }, // sky-50, sky-200
            { bg: '#fdf4ff', border: '#f5d0fe' }, // fuchsia-50, fuchsia-200
            { bg: '#f0fdf4', border: '#bbf7d0' }, // green-50, green-200
            { bg: '#fffbeb', border: '#fde68a' }, // amber-50, amber-200
            { bg: '#fef2f2', border: '#fecaca' }, // red-50, red-200
          ];
          const rowColor = rowColors[index % rowColors.length];

          return (
            <button
              key={edition.id}
              onClick={() => handleSelectEdition(edition)}
              disabled={isDisabled}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all border
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
              `}
              style={
                isSelected
                  ? { backgroundColor: '#6366f1', borderColor: '#6366f1', color: 'white' }
                  : { backgroundColor: rowColor.bg, borderColor: rowColor.border, color: '#374151' }
              }
            >
              {/* Nome edizione a sinistra */}
              <span className="truncate">
                Edizione {edition.edition_number}
              </span>

              {/* Badge posti a destra */}
              {edition.badges.sold_out ? (
                <span
                  className="ml-2 px-2 py-0.5 text-xs rounded font-semibold text-white flex-shrink-0"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Esaurito
                </span>
              ) : edition.badges.last_spots ? (
                <span
                  className="ml-2 px-2.5 py-1 text-xs rounded font-semibold text-white flex-shrink-0"
                  style={{ backgroundColor: '#f97316' }}
                >
                  Ultimi {edition.available_spots}!
                </span>
              ) : (
                <span
                  className="ml-2 px-2.5 py-1 text-xs rounded font-semibold flex-shrink-0"
                  style={
                    isSelected
                      ? { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }
                      : { backgroundColor: '#dcfce7', color: '#15803d' }
                  }
                >
                  {edition.available_spots} posti
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dettaglio edizione selezionata */}
      {selectedEdition && (
        <div
          className="border rounded-xl p-4 transition-all"
          style={{ borderColor: '#c4b5fd', backgroundColor: '#faf5ff' }}
        >
          {/* Header con date */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {sortedEditions.indexOf(selectedEdition) === 0 && !selectedEdition.badges.sold_out && (
                  <span
                    className="px-2 py-0.5 text-xs rounded-full font-semibold text-white"
                    style={{ backgroundColor: '#6366f1' }}
                  >
                    Consigliata
                  </span>
                )}
                <span className="font-semibold text-gray-900">
                  {selectedEdition.edition_name || `Edizione ${selectedEdition.edition_number}`}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar size={14} style={{ color: '#6366f1' }} />
                {formatDateIT(selectedEdition.start_date)}
                {selectedEdition.end_date && ` - ${formatDateIT(selectedEdition.end_date)}`}
              </div>
            </div>

            {/* Badge posti grande - Non mostrare se già iniziato (già visibile nella riga) */}
            {selectedEdition.badges.sold_out ? (
              <span
                className="px-3 py-1.5 text-sm rounded-lg text-white font-bold"
                style={{ backgroundColor: '#ef4444' }}
              >
                Esaurito
              </span>
            ) : selectedEdition.badges.already_started ? null : selectedEdition.badges.last_spots ? (
              <span
                className="px-3 py-1.5 text-sm rounded-lg text-white font-bold animate-pulse"
                style={{ backgroundColor: '#f97316' }}
              >
                Ultimi {selectedEdition.available_spots} posti!
              </span>
            ) : (
              <span className="px-3 py-1.5 text-sm rounded-lg bg-green-100 text-green-700 font-bold">
                {selectedEdition.available_spots} posti
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {selectedEdition.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} style={{ color: '#6366f1' }} />
                <span>{selectedEdition.location}</span>
              </div>
            )}
            {selectedEdition.teacher && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} style={{ color: '#6366f1' }} />
                <span>{selectedEdition.teacher.name}</span>
              </div>
            )}
            {selectedEdition.price !== null && selectedEdition.price > 0 && (
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span>€{selectedEdition.price.toLocaleString('it-IT')}</span>
              </div>
            )}
          </div>

          {/* Deadline countdown */}
          {selectedEdition.is_enrollments_open && selectedEdition.days_until_deadline !== null && selectedEdition.days_until_deadline >= 0 && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              {selectedEdition.days_until_deadline <= 7 ? (
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#f59e0b' }}
                >
                  <Clock size={16} />
                  <span>Iscrizioni entro {selectedEdition.days_until_deadline} giorni!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Iscrizioni entro: {formatDateIT(selectedEdition.enrollment_deadline)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default {
  CourseBadgesDisplay,
  CourseAvailability,
  DeadlineCountdown,
  CourseInfoCard,
  LiveIndicator,
  EditionsList,
};
