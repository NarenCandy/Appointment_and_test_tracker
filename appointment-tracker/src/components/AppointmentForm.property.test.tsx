import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { AppProvider, useAppState, useAppDispatch } from '../context/AppContext';
import { Appointment } from '../types';

describe('AppointmentForm - Property Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Feature: appointment-test-tracker, Property 1: Valid appointment creation increases list size
  // Validates: Requirements 1.1, 1.4
  describe('Property 1: Valid appointment creation increases list size', () => {
    it('should increase appointment list size by one for any valid appointment', () => {
      // Generate valid future dates
      const futureDateArbitrary = fc
        .integer({ min: Date.now() + 1000, max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
        .map(ms => new Date(ms));

      // Generate valid appointments
      const validAppointmentArbitrary = fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        datetime: futureDateArbitrary,
        location: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
        preparationNotes: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
        createdAt: futureDateArbitrary,
      }) as fc.Arbitrary<Appointment>;

      fc.assert(
        fc.property(
          validAppointmentArbitrary,
          (appointment) => {
            const { result } = renderHook(
              () => ({
                state: useAppState(),
                dispatch: useAppDispatch(),
              }),
              { wrapper: AppProvider }
            );

            const initialLength = result.current.state.appointments.length;

            act(() => {
              result.current.dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
            });

            const newLength = result.current.state.appointments.length;

            // List should grow by exactly one
            expect(newLength).toBe(initialLength + 1);

            // The new appointment should be in the list
            const addedAppointment = result.current.state.appointments.find(
              (apt) => apt.id === appointment.id
            );
            expect(addedAppointment).toBeDefined();
            expect(addedAppointment?.name).toBe(appointment.name);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
