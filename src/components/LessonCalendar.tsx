/**
 * Componente Calendario Lezioni
 * Visualizza le lezioni programmate di un corso in formato calendario
 * Design basato su Figma con layout card-based e gradiente
 */

import React from 'react';
import { Calendar, BookOpen, Clock } from 'lucide-react';

export interface Lesson {
  date: string;        // YYYY-MM-DD
  start_time: string;  // HH:MM o HH:MM:SS
  end_time: string;    // HH:MM o HH:MM:SS
  title: string;       // Titolo lezione
  description?: string; // Descrizione opzionale (es. "Aula: ONLINE")
}

interface LessonCalendarProps {
  lessons: Lesson[];
  className?: string;
  gradient?: string;   // Non più usato nel nuovo design, ma mantenuto per compatibilità
  bgGradient?: string; // Non più usato nel nuovo design, ma mantenuto per compatibilità
}

/**
 * Formatta la data in italiano
 * Ritorna { day: "15", month: "MAGGIO", year: "2025" }
 */
function formatDate(dateString: string): { day: string; month: string; year: string } {
  const date = new Date(dateString);
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const day = date.getDate().toString();
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString();

  return {
    day,
    month: month.toUpperCase(),
    year
  };
}

/**
 * Formatta l'orario (es: "09:00 - 13:00")
 */
function formatTime(startTime: string, endTime: string): string {
  // Rimuove i secondi se presenti (HH:MM:SS -> HH:MM)
  const start = startTime.substring(0, 5);
  const end = endTime.substring(0, 5);
  return `${start} - ${end}`;
}

export function LessonCalendar({
  lessons,
  className = '',
}: LessonCalendarProps) {
  // Debug: verifica quante lezioni arrivano al componente
  console.log('[LessonCalendar] Lezioni ricevute:', lessons?.length, lessons);

  if (!lessons || lessons.length === 0) {
    return null;
  }

  return (
    <div className={`calendar-container ${className}`}>
      {/* Decorative blur - top right */}
      <div className="decorative-blur"></div>

      {/* Container principale scrollabile */}
      <div className="lessons-wrapper">
        {/* Header fisso */}
        <div className="calendar-header">
          <div className="header-left">
            <div className="icon-badge">
              <Calendar size={24} strokeWidth={2} className="text-white" />
            </div>
            <h2 className="header-title">Calendario Lezioni</h2>
          </div>
          <div className="lessons-count-badge">
            <BookOpen size={16} strokeWidth={2.5} />
            <span>{lessons.length} Lezioni programmate</span>
          </div>
        </div>

        {/* Lista lezioni scrollabile */}
        <div className="lessons-scroll-area">
          <div className="lessons-list">
            {lessons.map((lesson, idx) => {
              const { day, month, year } = formatDate(lesson.date);
              const timeRange = formatTime(lesson.start_time, lesson.end_time);
              
              return (
                <div key={idx} className="lesson-card">
                  {/* Date Box */}
                  <div className="date-box">
                    <div className="day-number">{day}</div>
                    <div className="month-year">
                      <span className="month-text">{month} {year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lesson-content">
                    <div className="content-row">
                      <h4 className="lesson-title">{lesson.title}</h4>
                      <div className="time-badge">
                        <Clock size={10} strokeWidth={2.5} className="time-icon" />
                        <span className="time-text">{timeRange}</span>
                      </div>
                    </div>
                    {lesson.description && (
                      <p className="lesson-description">{lesson.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gradient fade al bottom */}
        <div className="gradient-fade"></div>
      </div>

      <style>{`
        .calendar-container {
          position: relative;
          flex-shrink: 0;
          align-self: stretch;
          height: 545px;
          border-radius: 24px;
          border: 0.571px solid #F3F4F6;
          background: #FFF;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10);
        }

        .decorative-blur {
          position: absolute;
          left: 666px;
          top: -127px;
          width: 256px;
          height: 256px;
          border-radius: 50%;
          opacity: 0.2;
          background: linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%);
          filter: blur(64px);
          pointer-events: none;
        }

        .lessons-wrapper {
          position: relative;
          width: 730px;
          max-width: 100%;
          margin: 0 auto;
          padding: 33px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-badge {
          display: flex;
          width: 48px;
          height: 48px;
          padding: 12px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #7F22FE 0%, #AD46FF 50%, #615FFF 100%);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10);
        }

        .header-title {
          color: #101828;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 32px;
          margin: 0;
        }

        .lessons-count-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: #FAF5FF;
        }

        .lessons-count-badge span {
          color: #8200DB;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
        }

        .lessons-count-badge svg {
          color: #8200DB;
          stroke-width: 2.5;
        }

        .lessons-scroll-area {
          position: relative;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 12px;
          margin-right: -12px;
        }

        .lessons-scroll-area::-webkit-scrollbar {
          width: 6px;
        }

        .lessons-scroll-area::-webkit-scrollbar-track {
          background: #F9FAFB;
          border-radius: 10px;
        }

        .lessons-scroll-area::-webkit-scrollbar-thumb {
          background: #8200DB;
          border-radius: 10px;
        }

        .lessons-scroll-area::-webkit-scrollbar-thumb:hover {
          background: #6b05ad;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lesson-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          min-height: 92px;
          border-radius: 10px;
          border: 0.571px solid #E5E7EB;
          background: #F9FAFB;
        }

        .date-box {
          display: flex;
          width: 80px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8px 0;
          border-radius: 10px;
          border: 0.571px solid #E5E7EB;
          background: #FFF;
          flex-shrink: 0;
        }

        .day-number {
          color: #101828;
          text-align: center;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 20px;
        }

        .month-year {
          margin-top: 4px;
        }

        .month-text {
          color: #6A7282;
          text-align: center;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          line-height: 15px;
          text-transform: uppercase;
        }

        .lesson-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .content-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .lesson-title {
          color: #101828;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          margin: 0;
          flex: 1;
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 4px;
          border: 0.571px solid #F3F4F6;
          background: #FFF;
          flex-shrink: 0;
        }

        .time-icon {
          color: #6A7282;
        }

        .time-text {
          color: #6A7282;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          line-height: 15px;
          white-space: nowrap;
        }

        .lesson-description {
          color: #4A5565;
          font-family: Arial, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          margin: 0;
        }

        .gradient-fade {
          position: absolute;
          left: 0;
          bottom: 0;
          right: 12px;
          height: 32px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFF 100%);
          pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .calendar-container {
            height: 400px;
            max-height: 400px;
            overflow: hidden;
          }

          .lessons-wrapper {
            width: 100%;
            padding: 16px;
            height: 100%;
            overflow: hidden;
          }

          .calendar-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .header-title {
            font-size: 18px;
            line-height: 24px;
          }

          .icon-badge {
            width: 40px;
            height: 40px;
            padding: 8px;
          }

          .icon-badge svg {
            width: 20px;
            height: 20px;
          }

          .lessons-count-badge {
            padding: 6px 12px;
          }

          .lessons-count-badge span {
            font-size: 12px;
          }

          .lessons-scroll-area {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 24px;
          }

          .lesson-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
            min-height: auto;
          }

          .date-box {
            width: 100%;
            flex-direction: row;
            justify-content: center;
            gap: 8px;
            padding: 6px 0;
          }

          .day-number {
            font-size: 16px;
          }

          .month-year {
            margin-top: 0;
          }

          .month-text {
            font-size: 9px;
          }

          .content-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .lesson-title {
            font-size: 14px;
            line-height: 20px;
          }

          .time-badge {
            align-self: flex-start;
          }

          .lesson-description {
            font-size: 11px;
          }

          .decorative-blur {
            display: none;
          }

          .gradient-fade {
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default LessonCalendar;
