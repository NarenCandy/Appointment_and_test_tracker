import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveAppointments,
  loadAppointments,
  clearAppointments,
  saveThemePreference,
  loadThemePreference,
} from './storageService';
import { Appointment } from '../types';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveAppointments and loadAppointments', () => {
    it('should save and load empty array', () => {
      saveAppointments([]);
      const loaded = loadAppointments();
      expect(loaded).toEqual([]);
    });

    it('should save and load single appointment', () => {
      const appointment: Appointment = {
        id: '123',
        name: 'Test Appointment',
        datetime: new Date('2025-12-01T10:00:00Z'),
        location: 'Test Location',
        preparationNotes: 'Test notes',
        createdAt: new Date('2025-11-23T10:00:00Z'),
      };

      saveAppointments([appointment]);
      const loaded = loadAppointments();

      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe(appointment.id);
      expect(loaded[0].name).toBe(appointment.name);
      expect(loaded[0].datetime.getTime()).toBe(appointment.datetime.getTime());
      expect(loaded[0].location).toBe(appointment.location);
      expect(loaded[0].preparationNotes).toBe(appointment.preparationNotes);
      expect(loaded[0].createdAt.getTime()).toBe(appointment.createdAt.getTime());
    });

    it('should save and load multiple appointments', () => {
      const appointments: Appointment[] = [
        {
          id: '1',
          name: 'Appointment 1',
          datetime: new Date('2025-12-01T10:00:00Z'),
          createdAt: new Date('2025-11-23T10:00:00Z'),
        },
        {
          id: '2',
          name: 'Appointment 2',
          datetime: new Date('2025-12-02T14:00:00Z'),
          location: 'Location 2',
          createdAt: new Date('2025-11-23T11:00:00Z'),
        },
      ];

      saveAppointments(appointments);
      const loaded = loadAppointments();

      expect(loaded).toHaveLength(2);
      expect(loaded[0].id).toBe('1');
      expect(loaded[1].id).toBe('2');
    });

    it('should handle corrupted JSON gracefully', () => {
      // Manually set corrupted data
      localStorage.setItem('appointments', 'invalid json {');
      
      const loaded = loadAppointments();
      expect(loaded).toEqual([]);
    });

    it('should handle non-array data gracefully', () => {
      // Manually set non-array data
      localStorage.setItem('appointments', JSON.stringify({ not: 'an array' }));
      
      const loaded = loadAppointments();
      expect(loaded).toEqual([]);
    });

    it('should return empty array when no data exists', () => {
      const loaded = loadAppointments();
      expect(loaded).toEqual([]);
    });
  });

  describe('clearAppointments', () => {
    it('should clear appointments from storage', () => {
      const appointment: Appointment = {
        id: '123',
        name: 'Test',
        datetime: new Date(),
        createdAt: new Date(),
      };

      saveAppointments([appointment]);
      expect(loadAppointments()).toHaveLength(1);

      clearAppointments();
      expect(loadAppointments()).toHaveLength(0);
    });
  });

  describe('saveThemePreference and loadThemePreference', () => {
    it('should save and load light theme', () => {
      saveThemePreference('light');
      const loaded = loadThemePreference();
      expect(loaded).toBe('light');
    });

    it('should save and load dark theme', () => {
      saveThemePreference('dark');
      const loaded = loadThemePreference();
      expect(loaded).toBe('dark');
    });

    it('should return null when no theme preference exists', () => {
      const loaded = loadThemePreference();
      expect(loaded).toBeNull();
    });

    it('should return null for invalid theme values', () => {
      localStorage.setItem('theme', 'invalid');
      const loaded = loadThemePreference();
      expect(loaded).toBeNull();
    });
  });
});
