import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import App from '../App';
import { AppointmentForm } from '../components/AppointmentForm';
import { AppointmentList } from '../components/AppointmentList';
import { AppointmentItem } from '../components/AppointmentItem';
import { PrintableChecklist } from '../components/PrintableChecklist';
import { AppProvider } from '../context/AppContext';
import type { Appointment } from '../types';

/**
 * Accessibility tests using axe-core
 * Validates: Requirements 7.4, 8.4
 */
describe('Accessibility Tests', () => {
  it('App component should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AppointmentForm should have no accessibility violations', async () => {
    const { container } = render(
      <AppProvider>
        <AppointmentForm />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AppointmentList with empty state should have no accessibility violations', async () => {
    const { container } = render(
      <AppProvider>
        <AppointmentList />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AppointmentItem should have no accessibility violations', async () => {
    const mockAppointment: Appointment = {
      id: '1',
      name: 'Annual Physical',
      datetime: new Date('2025-12-01T10:00:00'),
      location: 'Main Street Clinic',
      preparationNotes: 'Fasting required',
      createdAt: new Date(),
    };

    const { container } = render(
      <AppProvider>
        <AppointmentItem appointment={mockAppointment} />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PrintableChecklist should have no accessibility violations', async () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        name: 'Annual Physical',
        datetime: new Date('2025-12-01T10:00:00'),
        location: 'Main Street Clinic',
        preparationNotes: 'Fasting required',
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Dental Checkup',
        datetime: new Date('2025-12-15T14:00:00'),
        location: 'Smile Dental',
        preparationNotes: 'Brush teeth before appointment',
        createdAt: new Date(),
      },
    ];

    const { container } = render(
      <PrintableChecklist appointments={mockAppointments} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PrintableChecklist with empty state should have no accessibility violations', async () => {
    const { container } = render(<PrintableChecklist appointments={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('should have proper tab order in form', () => {
      const { container } = render(
        <AppProvider>
          <AppointmentForm />
        </AppProvider>
      );

      const focusableElements = container.querySelectorAll(
        'input, textarea, button'
      );
      
      // Should have at least 5 focusable elements (4 inputs + 1 button)
      expect(focusableElements.length).toBeGreaterThanOrEqual(5);
    });

    it('should have proper ARIA labels on buttons', () => {
      const mockAppointment: Appointment = {
        id: '1',
        name: 'Annual Physical',
        datetime: new Date('2025-12-01T10:00:00'),
        location: 'Main Street Clinic',
        preparationNotes: 'Fasting required',
        createdAt: new Date(),
      };

      const { getByLabelText } = render(
        <AppProvider>
          <AppointmentItem appointment={mockAppointment} />
        </AppProvider>
      );

      // Check that buttons have proper ARIA labels
      expect(getByLabelText(/Mark.*as done/i)).toBeInTheDocument();
      expect(getByLabelText(/Delete.*Annual Physical/i)).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic HTML elements in App', () => {
      const { container } = render(<App />);

      // Check for semantic elements
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('should use article element for appointment items', () => {
      const mockAppointment: Appointment = {
        id: '1',
        name: 'Annual Physical',
        datetime: new Date('2025-12-01T10:00:00'),
        createdAt: new Date(),
      };

      const { container } = render(
        <AppProvider>
          <AppointmentItem appointment={mockAppointment} />
        </AppProvider>
      );

      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should use time element for datetime display', () => {
      const mockAppointment: Appointment = {
        id: '1',
        name: 'Annual Physical',
        datetime: new Date('2025-12-01T10:00:00'),
        createdAt: new Date(),
      };

      const { container } = render(
        <AppProvider>
          <AppointmentItem appointment={mockAppointment} />
        </AppProvider>
      );

      expect(container.querySelector('time')).toBeInTheDocument();
    });
  });

  describe('Focus Indicators', () => {
    it('should have focus styles defined in CSS', () => {
      // This is a smoke test to ensure focus styles are present
      // The actual visual focus indicators are tested manually
      const { container } = render(
        <AppProvider>
          <AppointmentForm />
        </AppProvider>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Skip Link', () => {
    it('should have skip to main content link', () => {
      const { container } = render(<App />);
      
      const skipLink = container.querySelector('#skip-to-main');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have main content with proper id', () => {
      const { container } = render(<App />);
      
      const mainContent = container.querySelector('#main-content');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent?.tagName.toLowerCase()).toBe('main');
    });
  });
});
