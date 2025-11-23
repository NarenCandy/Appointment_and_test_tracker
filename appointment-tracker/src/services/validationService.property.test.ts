import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateAppointment } from './validationService';
import { AppointmentFormData } from '../types';

// Helper to generate future dates
const futureDateArbitrary = () => {
  const now = Date.now();
  const oneYearFromNow = now + 365 * 24 * 60 * 60 * 1000;
  return fc.integer({ min: now + 1000, max: oneYearFromNow }).map(ms => new Date(ms).toISOString());
};

describe('ValidationService - Property Tests', () => {
  // Feature: appointment-test-tracker, Property 2: Invalid appointments are rejected with validation errors
  // Validates: Requirements 1.2
  describe('Property 2: Invalid appointments are rejected with validation errors', () => {
    it('should reject appointments with missing required fields', () => {
      fc.assert(
        fc.property(
          // Generate appointment data with various combinations of missing/invalid fields
          fc.record({
            name: fc.oneof(
              fc.constant(''),           // Empty string
              fc.constant('   '),        // Whitespace only
              fc.string().filter(s => s.trim().length === 0) // Various whitespace
            ),
            datetime: fc.oneof(
              fc.constant(''),           // Empty datetime
              fc.date().map(d => d.toISOString()) // Valid datetime (may be past or future)
            ),
            location: fc.string(),
            preparationNotes: fc.string(),
          }),
          (invalidData) => {
            const errors = validateAppointment(invalidData as AppointmentFormData);
            
            // Should have at least one error for the empty name
            expect(errors.length).toBeGreaterThan(0);
            
            // Should have an error for the name field
            const nameError = errors.find(e => e.field === 'name');
            expect(nameError).toBeDefined();
            expect(nameError?.message).toBe('Name is required');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject appointments with names exceeding 200 characters', () => {
      fc.assert(
        fc.property(
          fc.record({
            // Generate names where TRIMMED length is > 200 chars
            name: fc.string({ minLength: 201, maxLength: 500 }).filter(s => s.trim().length > 200),
            datetime: futureDateArbitrary(),
            location: fc.string({ maxLength: 500 }),
            preparationNotes: fc.string({ maxLength: 2000 }),
          }),
          (invalidData) => {
            const errors = validateAppointment(invalidData as AppointmentFormData);
            
            // Should have an error for name length
            const nameError = errors.find(e => e.field === 'name');
            expect(nameError).toBeDefined();
            expect(nameError?.message).toBe('Name cannot exceed 200 characters');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject appointments with location exceeding 500 characters', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
            datetime: futureDateArbitrary(),
            location: fc.string({ minLength: 501, maxLength: 1000 }), // Location longer than 500 chars
            preparationNotes: fc.string({ maxLength: 2000 }),
          }),
          (invalidData) => {
            const errors = validateAppointment(invalidData as AppointmentFormData);
            
            // Should have an error for location length
            const locationError = errors.find(e => e.field === 'location');
            expect(locationError).toBeDefined();
            expect(locationError?.message).toBe('Location cannot exceed 500 characters');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject appointments with preparation notes exceeding 2000 characters', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
            datetime: futureDateArbitrary(),
            location: fc.string({ maxLength: 500 }),
            preparationNotes: fc.string({ minLength: 2001, maxLength: 3000 }), // Notes longer than 2000 chars
          }),
          (invalidData) => {
            const errors = validateAppointment(invalidData as AppointmentFormData);
            
            // Should have an error for preparation notes length
            const notesError = errors.find(e => e.field === 'preparationNotes');
            expect(notesError).toBeDefined();
            expect(notesError?.message).toBe('Preparation notes cannot exceed 2000 characters');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: appointment-test-tracker, Property 3: Past datetime appointments are rejected
  // Validates: Requirements 1.3
  describe('Property 3: Past datetime appointments are rejected', () => {
    it('should reject all appointments with past datetimes', () => {
      // Helper to generate past dates
      const pastDateArbitrary = () => {
        const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return fc.integer({ min: oneYearAgo, max: now - 1000 }).map(ms => new Date(ms).toISOString());
      };

      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
            datetime: pastDateArbitrary(), // Generate past dates
            location: fc.string({ maxLength: 500 }),
            preparationNotes: fc.string({ maxLength: 2000 }),
          }),
          (invalidData) => {
            const errors = validateAppointment(invalidData as AppointmentFormData);
            
            // Should have an error for past datetime
            const datetimeError = errors.find(e => e.field === 'datetime');
            expect(datetimeError).toBeDefined();
            expect(datetimeError?.message).toBe('Date and time must be in the future');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
