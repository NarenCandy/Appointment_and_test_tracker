import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  saveAppointments,
  loadAppointments,
  saveThemePreference,
  loadThemePreference,
} from './storageService';
import { Appointment } from '../types';

describe('StorageService - Property Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  // Feature: appointment-test-tracker, Property 11: Appointment persistence round trip
  // Validates: Requirements 5.1, 5.2
  describe('Property 11: Appointment persistence round trip', () => {
    it('should preserve appointment data through save and load cycle', () => {
      // Arbitrary for generating valid appointments
      const validDateArbitrary = fc
        .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() })
        .map(ms => new Date(ms));

      const appointmentArbitrary = fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        datetime: validDateArbitrary,
        location: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
        preparationNotes: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
        createdAt: validDateArbitrary,
        googleCalendarEventId: fc.option(fc.string(), { nil: undefined }),
      }) as fc.Arbitrary<Appointment>;

      fc.assert(
        fc.property(
          fc.array(appointmentArbitrary, { maxLength: 20 }),
          (appointments) => {
            // Save appointments
            saveAppointments(appointments);

            // Load appointments
            const loaded = loadAppointments();

            // Should have same length
            expect(loaded).toHaveLength(appointments.length);

            // Verify each appointment is preserved
            appointments.forEach((original, index) => {
              const loadedAppointment = loaded[index];

              expect(loadedAppointment.id).toBe(original.id);
              expect(loadedAppointment.name).toBe(original.name);
              expect(loadedAppointment.datetime.getTime()).toBe(original.datetime.getTime());
              expect(loadedAppointment.location).toBe(original.location);
              expect(loadedAppointment.preparationNotes).toBe(original.preparationNotes);
              expect(loadedAppointment.createdAt.getTime()).toBe(original.createdAt.getTime());
              expect(loadedAppointment.googleCalendarEventId).toBe(original.googleCalendarEventId);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 12: Theme preference persistence round trip
  // Validates: Requirements 9.1, 9.3
  describe('Property 12: Theme preference persistence round trip', () => {
    it('should preserve theme preference through save and load cycle', () => {
      const themeArbitrary = fc.constantFrom('light' as const, 'dark' as const);

      fc.assert(
        fc.property(
          themeArbitrary,
          (theme) => {
            // Save theme preference
            saveThemePreference(theme);

            // Load theme preference
            const loaded = loadThemePreference();

            // Should match the saved theme
            expect(loaded).toBe(theme);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
