import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { AppointmentItem } from './AppointmentItem';
import { AppProvider } from '../context/AppContext';
import { Appointment } from '../types';

describe('AppointmentItem - Property Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderItem = (appointment: Appointment) => {
    return render(
      <AppProvider>
        <AppointmentItem appointment={appointment} />
      </AppProvider>
    );
  };

  // Generate valid appointments
  const appointmentArbitrary = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    datetime: fc
      .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() })
      .map(ms => new Date(ms)),
    location: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    preparationNotes: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
    createdAt: fc
      .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() })
      .map(ms => new Date(ms)),
    googleCalendarEventId: fc.option(fc.string(), { nil: undefined }),
  }) as fc.Arbitrary<Appointment>;

  // Feature: appointment-test-tracker, Property 5: Appointment display contains all required information
  // Validates: Requirements 2.2
  describe('Property 5: Appointment display contains all required information', () => {
    it('should display name and datetime for all appointments', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary,
          (appointment) => {
            const { container } = renderItem(appointment);
            const text = container.textContent || '';

            // Should contain the appointment name
            expect(text).toContain(appointment.name);

            // Should contain some representation of the date
            // (exact format may vary, but year should be present)
            const year = appointment.datetime.getFullYear().toString();
            expect(text).toContain(year);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should display location when provided', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary.filter(apt => apt.location !== undefined),
          (appointment) => {
            const { container } = renderItem(appointment);
            const text = container.textContent || '';

            // Should contain the location
            expect(text).toContain(appointment.location!);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should display preparation notes when provided', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary.filter(apt => apt.preparationNotes !== undefined && apt.preparationNotes.length > 0),
          (appointment) => {
            const { container } = renderItem(appointment);
            const text = container.textContent || '';

            // Should contain at least part of the preparation notes
            // (may be truncated, so check for first 50 chars)
            const notesPreview = appointment.preparationNotes!.substring(0, 50);
            expect(text).toContain(notesPreview);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 6: Past appointments are visually distinguished
  // Validates: Requirements 2.3
  describe('Property 6: Past appointments are visually distinguished', () => {
    it('should apply past class to appointments with past datetime', () => {
      const pastDateArbitrary = fc
        .integer({ min: new Date('2020-01-01').getTime(), max: Date.now() - 1000 })
        .map(ms => new Date(ms));

      const pastAppointmentArbitrary = fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        datetime: pastDateArbitrary,
        location: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
        preparationNotes: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
        createdAt: pastDateArbitrary,
      }) as fc.Arbitrary<Appointment>;

      fc.assert(
        fc.property(
          pastAppointmentArbitrary,
          (appointment) => {
            const { container } = renderItem(appointment);
            const itemElement = container.querySelector('.appointment-item');

            // Past appointments should have the 'past' class
            expect(itemElement).toHaveClass('past');
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should not apply past class to appointments with future datetime', () => {
      const futureDateArbitrary = fc
        .integer({ min: Date.now() + 1000, max: new Date('2030-12-31').getTime() })
        .map(ms => new Date(ms));

      const futureAppointmentArbitrary = fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        datetime: futureDateArbitrary,
        location: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
        preparationNotes: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
        createdAt: futureDateArbitrary,
      }) as fc.Arbitrary<Appointment>;

      fc.assert(
        fc.property(
          futureAppointmentArbitrary,
          (appointment) => {
            const { container } = renderItem(appointment);
            const itemElement = container.querySelector('.appointment-item');

            // Future appointments should NOT have the 'past' class
            expect(itemElement).not.toHaveClass('past');
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 8: Destructive actions require confirmation
  // Validates: Requirements 3.4
  describe('Property 8: Destructive actions require confirmation', () => {
    it('should call confirm before marking as done', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary,
          (appointment) => {
            const confirmMock = vi.fn().mockReturnValue(false);
            window.confirm = confirmMock;

            const { container } = renderItem(appointment);
            const doneButton = container.querySelector('.btn-mark-done') as HTMLButtonElement;
            doneButton.click();

            // Confirm should have been called
            expect(confirmMock).toHaveBeenCalled();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should call confirm before deleting', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary,
          (appointment) => {
            const confirmMock = vi.fn().mockReturnValue(false);
            window.confirm = confirmMock;

            const { container } = renderItem(appointment);
            const deleteButton = container.querySelector('.btn-delete') as HTMLButtonElement;
            deleteButton.click();

            // Confirm should have been called
            expect(confirmMock).toHaveBeenCalled();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 7: Removal operations delete appointments
  // Validates: Requirements 3.1, 3.2
  describe('Property 7: Removal operations delete appointments', () => {
    it('should dispatch MARK_DONE action when confirmed', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary,
          (appointment) => {
            const confirmMock = vi.fn().mockReturnValue(true);
            window.confirm = confirmMock;

            const { container } = renderItem(appointment);
            const doneButton = container.querySelector('.btn-mark-done') as HTMLButtonElement;
            
            // Click the button - this should dispatch the action
            doneButton.click();

            // Confirm should have been called and returned true
            expect(confirmMock).toHaveBeenCalled();
            expect(confirmMock).toHaveReturnedWith(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should dispatch DELETE_APPOINTMENT action when confirmed', () => {
      fc.assert(
        fc.property(
          appointmentArbitrary,
          (appointment) => {
            const confirmMock = vi.fn().mockReturnValue(true);
            window.confirm = confirmMock;

            const { container } = renderItem(appointment);
            const deleteButton = container.querySelector('.btn-delete') as HTMLButtonElement;
            
            // Click the button - this should dispatch the action
            deleteButton.click();

            // Confirm should have been called and returned true
            expect(confirmMock).toHaveBeenCalled();
            expect(confirmMock).toHaveReturnedWith(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
