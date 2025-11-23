import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import './App.css';
import { AppProvider, useAppState } from './context/AppContext';
import { AppointmentForm } from './components/AppointmentForm';
import { AppointmentList } from './components/AppointmentList';
import { ThemeToggle } from './components/ThemeToggle';
import type { FilterCriteria } from './components/FilterPanel';
import { filterByKeyword, filterByDateRange, sortAppointmentsByDatetime } from './utils/appointmentUtils';

// Lazy load optional features for better performance
const FilterPanel = lazy(() => import('./components/FilterPanel').then(module => ({ default: module.FilterPanel })));
const GoogleCalendarIntegration = lazy(() => import('./components/GoogleCalendarIntegration').then(module => ({ default: module.GoogleCalendarIntegration })));

/**
 * AppContent component that uses theme from context
 * Separated to allow access to AppContext hooks
 */
function AppContent() {
  const { theme, appointments, isLoading, error } = useAppState();
  const [filters, setFilters] = useState<FilterCriteria>({
    keyword: '',
    startDate: null,
    endDate: null,
  });

  // Apply filters to appointments and maintain sort order
  const filteredAppointments = useCallback(() => {
    let result = appointments;

    // Apply keyword filter
    if (filters.keyword) {
      result = filterByKeyword(result, filters.keyword);
    }

    // Apply date range filter
    if (filters.startDate || filters.endDate) {
      result = filterByDateRange(result, filters.startDate, filters.endDate);
    }

    // Maintain sort order
    return sortAppointmentsByDatetime(result);
  }, [appointments, filters]);

  const handleFilterChange = useCallback((newFilters: FilterCriteria) => {
    setFilters(newFilters);
  }, []);

  // Apply theme to document root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle skip link navigation
  useEffect(() => {
    const skipLink = document.getElementById('skip-to-main');
    const mainContent = document.getElementById('main-content');

    const handleSkipLinkClick = (e: MouseEvent) => {
      e.preventDefault();
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (skipLink) {
      skipLink.addEventListener('click', handleSkipLinkClick);
      return () => skipLink.removeEventListener('click', handleSkipLinkClick);
    }
  }, []);

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" id="skip-to-main" className="skip-link">
        Skip to main content
      </a>

      <div className="app-container">
        {/* Header with semantic nav element */}
        <header role="banner">
          <div className="header-content">
            <h1>Appointment & Test Tracker</h1>
            <ThemeToggle />
          </div>
          <nav aria-label="Main navigation">
            {/* Navigation can be expanded in future with additional features */}
          </nav>
        </header>

        {/* Main content area with semantic main element */}
        <main id="main-content" tabIndex={-1} role="main">
          {/* Display error message if present */}
          {error && (
            <div className="error-banner" role="alert" aria-live="polite">
              <p>{error}</p>
            </div>
          )}

          {/* Display loading state */}
          {isLoading ? (
            <div className="loading-container" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>Loading your appointments...</p>
            </div>
          ) : (
            <>
              <section aria-labelledby="add-appointment-heading">
                <h2 id="add-appointment-heading" className="visually-hidden">
                  Add New Appointment
                </h2>
                <AppointmentForm />
              </section>

              {/* Google Calendar Integration - Optional Feature */}
              <section aria-labelledby="calendar-integration-heading">
                <h2 id="calendar-integration-heading" className="visually-hidden">
                  Google Calendar Integration
                </h2>
                <Suspense fallback={<div className="loading-placeholder">Loading calendar integration...</div>}>
                  <GoogleCalendarIntegration />
                </Suspense>
              </section>

              <section aria-labelledby="appointments-heading">
                <h2 id="appointments-heading">Your Appointments</h2>
                <Suspense fallback={<div className="loading-placeholder">Loading filters...</div>}>
                  <FilterPanel onFilterChange={handleFilterChange} />
                </Suspense>
                <AppointmentList appointments={filteredAppointments()} />
              </section>
            </>
          )}
        </main>

        {/* Footer with semantic footer element */}
        <footer role="contentinfo">
          <p className="footer-text">
            Appointment & Test Tracker - Your medical appointments organized
          </p>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
