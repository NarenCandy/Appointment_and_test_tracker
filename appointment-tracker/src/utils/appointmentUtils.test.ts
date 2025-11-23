import { describe, it, expect } from 'vitest';
import {
  sortAppointmentsByDatetime,
  isPastAppointment,
  filterByKeyword,
  filterByDateRange,
} from './appointmentUtils';
import { Appointment } from '../types';

describe('appointmentUtils', () => {
  describe('sortAppointmentsByDatetime', () => {
    it('should sort appointments by datetime in ascending order', () => {
      const appointments: Appointment[] = [
        {
          id: '3',
          name: 'Third',
          datetime: new Date('2025-12-03T10:00:00Z'),
          createdAt: new Date(),
        },
        {
          id: '1',
          name: 'First',
          datetime: new Date('2025-12-01T10:00:00Z'),
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Second',
          datetime: new Date('2025-12-02T10:00:00Z'),
          createdAt: new Date(),
        },
      ];

      const sorted = sortAppointmentsByDatetime(appointments);

      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('should not mutate the original array', () => {
      const appointments: Appointment[] = [
        {
          id: '2',
          name: 'Second',
          datetime: new Date('2025-12-02T10:00:00Z'),
          createdAt: new Date(),
        },
        {
          id: '1',
          name: 'First',
          datetime: new Date('2025-12-01T10:00:00Z'),
          createdAt: new Date(),
        },
      ];

      const sorted = sortAppointmentsByDatetime(appointments);

      expect(appointments[0].id).toBe('2'); // Original unchanged
      expect(sorted[0].id).toBe('1'); // Sorted version
    });
  });

  describe('isPastAppointment', () => {
    it('should return true for past appointments', () => {
      const pastAppointment: Appointment = {
        id: '1',
        name: 'Past',
        datetime: new Date('2020-01-01T10:00:00Z'),
        createdAt: new Date(),
      };

      expect(isPastAppointment(pastAppointment)).toBe(true);
    });

    it('should return false for future appointments', () => {
      const futureAppointment: Appointment = {
        id: '1',
        name: 'Future',
        datetime: new Date('2030-01-01T10:00:00Z'),
        createdAt: new Date(),
      };

      expect(isPastAppointment(futureAppointment)).toBe(false);
    });
  });

  describe('filterByKeyword', () => {
    const appointments: Appointment[] = [
      {
        id: '1',
        name: 'Annual Physical',
        datetime: new Date('2025-12-01T10:00:00Z'),
        location: 'Main Street Clinic',
        preparationNotes: 'Fasting required',
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Dental Checkup',
        datetime: new Date('2025-12-02T14:00:00Z'),
        location: 'Downtown Dentist',
        createdAt: new Date(),
      },
      {
        id: '3',
        name: 'Eye Exam',
        datetime: new Date('2025-12-03T09:00:00Z'),
        preparationNotes: 'Bring glasses',
        createdAt: new Date(),
      },
    ];

    it('should filter by name', () => {
      const filtered = filterByKeyword(appointments, 'physical');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should filter by location', () => {
      const filtered = filterByKeyword(appointments, 'downtown');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should filter by preparation notes', () => {
      const filtered = filterByKeyword(appointments, 'glasses');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('3');
    });

    it('should be case-insensitive', () => {
      const filtered = filterByKeyword(appointments, 'DENTAL');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should return all appointments for empty keyword', () => {
      const filtered = filterByKeyword(appointments, '');
      expect(filtered).toHaveLength(3);
    });

    it('should return all appointments for whitespace-only keyword', () => {
      const filtered = filterByKeyword(appointments, '   ');
      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no matches', () => {
      const filtered = filterByKeyword(appointments, 'nonexistent');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('filterByDateRange', () => {
    const appointments: Appointment[] = [
      {
        id: '1',
        name: 'First',
        datetime: new Date('2025-12-01T10:00:00Z'),
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Second',
        datetime: new Date('2025-12-05T10:00:00Z'),
        createdAt: new Date(),
      },
      {
        id: '3',
        name: 'Third',
        datetime: new Date('2025-12-10T10:00:00Z'),
        createdAt: new Date(),
      },
    ];

    it('should filter by start date only', () => {
      const filtered = filterByDateRange(
        appointments,
        new Date('2025-12-05T00:00:00Z'),
        null
      );
      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('2');
      expect(filtered[1].id).toBe('3');
    });

    it('should filter by end date only', () => {
      const filtered = filterByDateRange(
        appointments,
        null,
        new Date('2025-12-05T23:59:59Z')
      );
      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('2');
    });

    it('should filter by both start and end date', () => {
      const filtered = filterByDateRange(
        appointments,
        new Date('2025-12-02T00:00:00Z'),
        new Date('2025-12-09T23:59:59Z')
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should return all appointments when both dates are null', () => {
      const filtered = filterByDateRange(appointments, null, null);
      expect(filtered).toHaveLength(3);
    });
  });
});
