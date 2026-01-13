/**
 * Student Dashboard
 * Pagina riepilogo per l'allievo autenticato
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  FileText,
  Download,
  LogOut,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StudentEnrollment } from '../services/student-auth-api';
import '../styles/dashboard.css';

// ============================================
// COMPONENTI HELPER
// ============================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'purple' | 'green' | 'blue' | 'orange';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    purple: 'stat-card-purple',
    green: 'stat-card-green',
    blue: 'stat-card-blue',
    orange: 'stat-card-orange',
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

interface EnrollmentCardProps {
  enrollment: StudentEnrollment;
}

function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'In Attesa', className: 'badge-pending' },
      confirmed: { label: 'Confermato', className: 'badge-confirmed' },
      active: { label: 'In Corso', className: 'badge-active' },
      completed: { label: 'Completato', className: 'badge-completed' },
      withdrawn: { label: 'Ritirato', className: 'badge-withdrawn' },
      cancelled: { label: 'Annullato', className: 'badge-cancelled' },
    };
    return statusConfig[status] || { label: status, className: 'badge-default' };
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Da Pagare', className: 'payment-pending' },
      paid: { label: 'Pagato', className: 'payment-paid' },
      partial: { label: 'Parziale', className: 'payment-partial' },
    };
    return paymentConfig[status] || { label: status, className: 'payment-default' };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusBadge = getStatusBadge(enrollment.status);
  const paymentBadge = getPaymentBadge(enrollment.payment_status);

  return (
    <div className="enrollment-card">
      <div className="enrollment-card-header">
        <div className="enrollment-category">{enrollment.course_category}</div>
        <span className={`enrollment-badge ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </div>

      <h3 className="enrollment-title">{enrollment.course_title}</h3>
      <p className="enrollment-code">Codice: {enrollment.course_code}</p>

      <div className="enrollment-details">
        <div className="enrollment-detail">
          <Calendar size={16} />
          <span>Iscrizione: {formatDate(enrollment.enrollment_date)}</span>
        </div>
        {enrollment.start_date && (
          <div className="enrollment-detail">
            <Clock size={16} />
            <span>Inizio: {formatDate(enrollment.start_date)}</span>
          </div>
        )}
        {enrollment.end_date && (
          <div className="enrollment-detail">
            <CheckCircle size={16} />
            <span>Fine: {formatDate(enrollment.end_date)}</span>
          </div>
        )}
      </div>

      <div className="enrollment-footer">
        <span className={`payment-badge ${paymentBadge.className}`}>
          <CreditCard size={14} />
          {paymentBadge.label}
        </span>
        {enrollment.status === 'completed' && (
          <button className="download-certificate-btn">
            <Download size={16} />
            Certificato
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PRINCIPALE
// ============================================

export function StudentDashboard() {
  const { student, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  // Calcola statistiche
  const enrollments = student.enrollments || [];
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const activeCourses = enrollments.filter(e => e.status === 'active' || e.status === 'confirmed').length;
  const totalCourses = enrollments.length;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <Link to="/" className="dashboard-logo">
            <Home size={20} />
            <span>Innform</span>
          </Link>
          <div className="dashboard-user-menu">
            <span className="user-greeting">
              Ciao, {student.first_name}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="dashboard-welcome">
          <h1 className="welcome-title">
            Benvenuto nella tua Area Riservata
          </h1>
          <p className="welcome-subtitle">
            Qui puoi visualizzare i tuoi corsi, scaricare i certificati e gestire le tue informazioni.
          </p>
        </section>

        {/* Stats Cards */}
        <section className="dashboard-stats">
          <StatCard
            icon={<BookOpen size={24} />}
            label="Corsi Totali"
            value={totalCourses}
            color="purple"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="In Corso"
            value={activeCourses}
            color="blue"
          />
          <StatCard
            icon={<Award size={24} />}
            label="Completati"
            value={completedCourses}
            color="green"
          />
          <StatCard
            icon={<FileText size={24} />}
            label="Certificati"
            value={completedCourses}
            color="orange"
          />
        </section>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Profile Section */}
          <section className="dashboard-section profile-section">
            <div className="section-header">
              <User size={22} />
              <h2>I Tuoi Dati</h2>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <span>{student.first_name[0]}{student.last_name[0]}</span>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">
                  {student.first_name} {student.last_name}
                </h3>
                <div className="profile-details">
                  <div className="profile-detail">
                    <Mail size={16} />
                    <span>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="profile-detail">
                      <Phone size={16} />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.fiscal_code && (
                    <div className="profile-detail">
                      <FileText size={16} />
                      <span>{student.fiscal_code}</span>
                    </div>
                  )}
                  {student.city && (
                    <div className="profile-detail">
                      <MapPin size={16} />
                      <span>
                        {student.city}
                        {student.province && ` (${student.province})`}
                      </span>
                    </div>
                  )}
                  {student.birth_date && (
                    <div className="profile-detail">
                      <Calendar size={16} />
                      <span>
                        Nato il {new Date(student.birth_date).toLocaleDateString('it-IT')}
                        {student.birth_place && ` a ${student.birth_place}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Courses Section */}
          <section className="dashboard-section courses-section">
            <div className="section-header">
              <BookOpen size={22} />
              <h2>I Tuoi Corsi</h2>
            </div>

            {enrollments.length > 0 ? (
              <div className="enrollments-grid">
                {enrollments.map((enrollment) => (
                  <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            ) : (
              <div className="no-courses">
                <AlertCircle size={48} />
                <h3>Nessun corso trovato</h3>
                <p>Non sei ancora iscritto a nessun corso.</p>
                <Link to="/corsi" className="browse-courses-btn">
                  Scopri i nostri corsi
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Help Section */}
        <section className="dashboard-help">
          <div className="help-content">
            <h3>Hai bisogno di assistenza?</h3>
            <p>Il nostro team è a tua disposizione per qualsiasi domanda.</p>
            <div className="help-actions">
              <a href="mailto:info@innform.eu" className="help-link">
                <Mail size={18} />
                info@innform.eu
              </a>
              <a href="tel:+390123456789" className="help-link">
                <Phone size={18} />
                Chiamaci
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Innform. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}

export default StudentDashboard;
