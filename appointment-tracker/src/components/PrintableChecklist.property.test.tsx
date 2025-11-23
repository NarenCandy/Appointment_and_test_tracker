import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { PrintableChecklist } from './PrintableChecklist';
import type { Appointment } from '../types';

/**
 * Property-based tests for PrintableChecklist component
 * Feature: appointment-test-tracker
 */

describe('PrintableChecklist - Property Tests', () => {
  /**
   * Generator for past appointments (datetime in the past)
   */
  const pastAppointmentArb = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    datetime: fc.date({ max: new Date(Date.now() - 60000) }).filter(d => !isNaN(d.getTime())), // At least 1 minute in the past, must be valid
    location: fc.option(fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0), { nil: undefined }),
    preparationNotes: fc.option(fc.string({ minLength: 1, maxLength: 2000 }).filter(s => s.trim().length > 0), { nil: undefined }),
    createdAt: fc.date({ max: new Date() }).filter(d => !isNaN(d.getTime())),
    googleCalendarEventId: fc.option(fc.string(), { nil: undefined }),
  }) as fc.Arbitrary<Appointment>;

  /**
   * Generator for future appointments (datetime in the future)
   */
  const futureAppointmentArb = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    datetime: fc.date({ min: new Date(Date.now() + 60000), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())), // At least 1 minute in the future, max 1 year, must be valid
    location: fc.option(fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0), { nil: undefined }),
    preparationNotes: fc.option(fc.string({ minLength: 1, maxLength: 2000 }).filter(s => s.trim().length > 0), { nil: undefined }),
    createdAt: fc.date({ max: new Date() }).filter(d => !isNaN(d.getTime())),
    googleCalendarEventId: fc.option(fc.string(), { nil: undefined }),
  }) as fc.Arbitrary<Appointment>;

  /**
   * Property 9: Printable checklist contains only future appointments
   * Feature: appointment-test-tracker, Property 9: Printable checklist contains only future appointments
   * Validates: Requirements 4.1
   */
  it('should only display future appointments, filtering out past appointments', () => {
    fc.assert(
      fc.property(
        fc.array(pastAppointmentArb, { minLength: 1, maxLength: 10 }),
        fc.array(futureAppointmentArb, { minLength: 1, maxLength: 10 }),
        (pastAppointments, futureAppointments) => {
          const allAppointments = [...pastAppointments, ...futureAppointments];
          
          const { container } = render(<PrintableChecklist appointments={allAppointments} />);
          
          // Verify the number of checklist items matches the number of future appointments
          const checklistItems = container.querySelectorAll('.checklist-item');
          expect(checklistItems.length).toBe(futureAppointments.length);
          
          // Get all displayed appointment IDs
          const displayedIds = Array.from(checklistItems).map(item => {
            // Find the appointment in our lists by matching the displayed name
            const nameEl = item.querySelector('.checklist-appointment-name');
            const displayedName = nameEl?.textContent || '';
            
            // Find in future appointments (should exist)
            const futureMatch = futureAppointments.find(apt => apt.name === displayedName);
            return futureMatch?.id;
          }).filter(Boolean);
          
          // Check that all future appointment IDs are displayed
          futureAppointments.forEach((appointment) => {
            expect(displayedIds).toContain(appointment.id);
          });
          
          // Check that no past appointment IDs are displayed
          pastAppointments.forEach((appointment) => {
            expect(displayedIds).not.toContain(appointment.id);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9 (edge case): Empty list when all appointments are past
   */
  it('should display empty state when all appointments are in the past', () => {
    fc.assert(
      fc.property(
        fc.array(pastAppointmentArb, { minLength: 1, maxLength: 10 }),
        (pastAppointments) => {
          const { container } = render(<PrintableChecklist appointments={pastAppointments} />);
          
          // Check for empty state message
          const emptyMessage = container.querySelector('.checklist-empty');
          expect(emptyMessage).toBeInTheDocument();
          expect(emptyMessage?.textContent).toMatch(/no upcoming appointments/i);
          
          // Verify no appointment items are displayed
          const checklistItems = container.querySelectorAll('.checklist-item');
          expect(checklistItems.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9 (edge case): All appointments displayed when all are future
   */
  it('should display all appointments when all are in the future', () => {
    fc.assert(
      fc.property(
        fc.array(futureAppointmentArb, { minLength: 1, maxLength: 10 }),
        (futureAppointments) => {
          const { container } = render(<PrintableChecklist appointments={futureAppointments} />);
          
          // Verify the count
          const checklistItems = container.querySelectorAll('.checklist-item');
          expect(checklistItems.length).toBe(futureAppointments.length);
          
          // All future appointments should be displayed
          futureAppointments.forEach((appointment) => {
            const appointmentNames = Array.from(container.querySelectorAll('.checklist-appointment-name'));
            const found = appointmentNames.some(el => el.textContent === appointment.name);
            expect(found).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Printable checklist includes complete appointment details
   * Feature: appointment-test-tracker, Property 10: Printable checklist includes complete appointment details
   * Validates: Requirements 4.2
   */
  it('should include appointment name, datetime, location, and full preparation notes', () => {
    fc.assert(
      fc.property(
        futureAppointmentArb,
        (appointment) => {
          const { container } = render(<PrintableChecklist appointments={[appointment]} />);
          
          // Verify there is one checklist item
          const checklistItems = container.querySelectorAll('.checklist-item');
          expect(checklistItems.length).toBe(1);
          
          // Verify appointment name is displayed
          const appointmentName = container.querySelector('.checklist-appointment-name');
          expect(appointmentName).toBeInTheDocument();
          expect(appointmentName?.textContent).toBe(appointment.name);
          
          // Verify datetime is displayed (formatted)
          const datetimeText = container.querySelector('.checklist-datetime');
          expect(datetimeText).toBeInTheDocument();
          expect(datetimeText?.textContent).toContain('Date & Time:');
          
          // Verify location is displayed if present
          if (appointment.location) {
            const locationText = container.querySelector('.checklist-location');
            expect(locationText).toBeInTheDocument();
            expect(locationText?.textContent).toContain('Location:');
            expect(locationText?.textContent).toContain(appointment.location);
          }
          
          // Verify full preparation notes are displayed (not truncated)
          if (appointment.preparationNotes) {
            const notesSection = container.querySelector('.checklist-notes p');
            expect(notesSection).toBeInTheDocument();
            expect(notesSection?.textContent).toBe(appointment.preparationNotes);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10 (verification): Full notes are not truncated
   */
  it('should display full preparation notes without truncation', () => {
    const longNotesAppointmentArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
      datetime: fc.date({ min: new Date(Date.now() + 60000), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
      location: fc.option(fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0), { nil: undefined }),
      preparationNotes: fc.string({ minLength: 200, maxLength: 2000 }).filter(s => s.trim().length > 0), // Long notes
      createdAt: fc.date({ max: new Date() }).filter(d => !isNaN(d.getTime())),
      googleCalendarEventId: fc.option(fc.string(), { nil: undefined }),
    }) as fc.Arbitrary<Appointment>;

    fc.assert(
      fc.property(
        longNotesAppointmentArb,
        (appointment) => {
          const { container } = render(<PrintableChecklist appointments={[appointment]} />);
          
          // The full text should be present (not truncated with "...")
          const notesSection = container.querySelector('.checklist-notes p');
          expect(notesSection).toBeInTheDocument();
          
          // Verify no truncation indicator
          const displayedText = notesSection?.textContent || '';
          expect(displayedText).toBe(appointment.preparationNotes);
          expect(displayedText).not.toContain('...');
        }
      ),
      { numRuns: 100 }
    );
  });
});
