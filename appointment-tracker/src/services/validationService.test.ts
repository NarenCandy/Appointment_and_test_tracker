import { describe, it, expect } from 'vitest';
import { isNonEmptyString, isDatetimeInFuture, validateAppointment } from './validationService';
import { AppointmentFormData } from '../types';

describe('ValidationService', () => {
  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('test')).toBe(true);
      expect(isNonEmptyString('  test  ')).toBe(true);
    });

    it('should return false for empty or whitespace-only strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('\t\n')).toBe(false);
    });
  });

  describe('isDatetimeInFuture', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isDatetimeInFuture(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isDatetimeInFuture(pastDate)).toBe(false);
    });
  });

  describe('validateAppointment', () => {
    it('should return no errors for valid appointment data', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const validData: AppointmentFormData = {
        name: 'Annual Physical',
        datetime: futureDate.toISOString(),
        location: 'Main Street Clinic',
        preparationNotes: 'Fasting required',
      };

      const errors = validateAppointment(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return error for empty name', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const invalidData: AppointmentFormData = {
        name: '',
        datetime: futureDate.toISOString(),
        location: '',
        preparationNotes: '',
      };

      const errors = validateAppointment(invalidData);
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name is required',
      });
    });

    it('should return error for past datetime', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const invalidData: AppointmentFormData = {
        name: 'Test Appointment',
        datetime: pastDate.toISOString(),
        location: '',
        preparationNotes: '',
      };

      const errors = validateAppointment(invalidData);
      expect(errors).toContainEqual({
        field: 'datetime',
        message: 'Date and time must be in the future',
      });
    });

    it('should return error for name exceeding 200 characters', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const longName = 'a'.repeat(201);
      const invalidData: AppointmentFormData = {
        name: longName,
        datetime: futureDate.toISOString(),
        location: '',
        preparationNotes: '',
      };

      const errors = validateAppointment(invalidData);
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name cannot exceed 200 characters',
      });
    });

    it('should return error for location exceeding 500 characters', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const longLocation = 'a'.repeat(501);
      const invalidData: AppointmentFormData = {
        name: 'Test',
        datetime: futureDate.toISOString(),
        location: longLocation,
        preparationNotes: '',
      };

      const errors = validateAppointment(invalidData);
      expect(errors).toContainEqual({
        field: 'location',
        message: 'Location cannot exceed 500 characters',
      });
    });
  });
});
