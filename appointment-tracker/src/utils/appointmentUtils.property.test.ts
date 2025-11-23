import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  sortAppointmentsByDatetime,
  filterByKeyword,
  filterByDateRange,
} from './appointmentUtils';
import { Appointment } from '../types';

describe('appointmentUtils - Property Tests', () => {
  // Helper to generate valid appointments
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

  // Feature: appointment-test-tracker, Property 4: Appointments are always sorted by datetime ascending
  // Validates: Requirements 2.1, 10.4
  describe('Property 4: Appointments are always sorted by datetime ascending', () => {
    it('should always sort appointments in ascending order by datetime', () => {
      fc.assert(
        fc.property(
          fc.array(appointmentArbitrary, { minLength: 0, maxLength: 20 }),
          (appointments) => {
            const sorted = sortAppointmentsByDatetime(appointments);

            // Verify sorted order
            for (let i = 0; i < sorted.length - 1; i++) {
              const current = sorted[i].datetime.getTime();
              const next = sorted[i + 1].datetime.getTime();
              expect(current).toBeLessThanOrEqual(next);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 13: Keyword filter matches relevant fields
  // Validates: Requirements 10.1
  describe('Property 13: Keyword filter matches relevant fields', () => {
    it('should only return appointments where keyword appears in name, location, or preparation notes', () => {
      fc.assert(
        fc.property(
          fc.array(appointmentArbitrary, { minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), // Only non-whitespace keywords
          (appointments, keyword) => {
            const filtered = filterByKeyword(appointments, keyword);

            // Every filtered appointment should contain the keyword
            filtered.forEach((appointment) => {
              const lowerKeyword = keyword.toLowerCase();
              const nameMatch = appointment.name.toLowerCase().includes(lowerKeyword);
              const locationMatch = appointment.location?.toLowerCase().includes(lowerKeyword) || false;
              const notesMatch = appointment.preparationNotes?.toLowerCase().includes(lowerKeyword) || false;

              expect(nameMatch || locationMatch || notesMatch).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 14: Date range filter includes only appointments within range
  // Validates: Requirements 10.2
  describe('Property 14: Date range filter includes only appointments within range', () => {
    it('should only return appointments within the specified date range', () => {
      fc.assert(
        fc.property(
          fc.array(appointmentArbitrary, { minLength: 1, maxLength: 20 }),
          fc
            .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() })
            .map(ms => new Date(ms)),
          fc
            .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() })
            .map(ms => new Date(ms)),
          (appointments, date1, date2) => {
            // Ensure startDate <= endDate
            const startDate = date1 < date2 ? date1 : date2;
            const endDate = date1 < date2 ? date2 : date1;

            const filtered = filterByDateRange(appointments, startDate, endDate);

            // Every filtered appointment should be within the range
            filtered.forEach((appointment) => {
              const appointmentTime = appointment.datetime.getTime();
              const startTime = startDate.getTime();
              const endTime = endDate.getTime();

              expect(appointmentTime).toBeGreaterThanOrEqual(startTime);
              expect(appointmentTime).toBeLessThanOrEqual(endTime);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 15: Clearing filters restores full appointment list
  // Validates: Requirements 10.3
  describe('Property 15: Clearing filters restores full appointment list', () => {
    it('should return all appointments when filters are cleared', () => {
      fc.assert(
        fc.property(
          fc.array(appointmentArbitrary, { minLength: 0, maxLength: 20 }),
          (appointments) => {
            // Apply keyword filter with empty string (cleared)
            const keywordFiltered = filterByKeyword(appointments, '');
            expect(keywordFiltered).toHaveLength(appointments.length);

            // Apply date range filter with null dates (cleared)
            const dateFiltered = filterByDateRange(appointments, null, null);
            expect(dateFiltered).toHaveLength(appointments.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
