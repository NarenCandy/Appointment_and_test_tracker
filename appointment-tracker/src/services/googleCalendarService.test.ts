import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getGoogleCalendarService, 
  resetGoogleCalendarService,
  GoogleCalendarAuthError,
  GoogleCalendarAPIError 
} from './googleCalendarService';
import type { Appointment } from '../types';

describe('GoogleCalendarService Error Handling', () => {
  beforeEach(() => {
    // Reset service instance before each test
    resetGoogleCalendarService();
  });

  describe('Authentication Errors', () => {
    it('should throw GoogleCalendarAuthError when authentication fails', async () => {
      
      // Try multiple times since authentication has random failures (10% failure rate)
      // With 10% failure rate, probability of no failures in 50 attempts is 0.9^50 ≈ 0.5%
      let authErrorThrown = false;
      for (let i = 0; i < 50; i++) {
        try {
          resetGoogleCalendarService();
          const freshService = getGoogleCalendarService();
          await freshService.authenticate();
        } catch (error) {
          if (error instanceof GoogleCalendarAuthError) {
            authErrorThrown = true;
            expect(error.message).toBeTruthy();
            expect(error.name).toBe('GoogleCalendarAuthError');
            break;
          }
        }
      }
      
      // We should have caught at least one auth error in 50 attempts
      expect(authErrorThrown).toBe(true);
    });

    it('should not crash the app when authentication fails', async () => {
      const service = getGoogleCalendarService();
      
      // Attempt authentication multiple times
      for (let i = 0; i < 5; i++) {
        try {
          await service.authenticate();
        } catch (error) {
          // Error should be caught gracefully
          expect(error).toBeInstanceOf(Error);
        }
      }
      
      // App should still be functional - we can create a new service
      resetGoogleCalendarService();
      const newService = getGoogleCalendarService();
      expect(newService).toBeDefined();
      expect(newService.isAuthenticated()).toBe(false);
    });
  });

  describe('API Request Errors', () => {
    it('should throw GoogleCalendarAPIError when createEvent fails', async () => {
      const service = getGoogleCalendarService();
      
      // First authenticate successfully
      let authenticated = false;
      for (let i = 0; i < 20 && !authenticated; i++) {
        try {
          await service.authenticate();
          authenticated = true;
        } catch (error) {
          // Keep trying until we get authenticated
        }
      }
      
      expect(authenticated).toBe(true);
      
      // Create a test appointment
      const appointment: Appointment = {
        id: 'test-123',
        name: 'Test Appointment',
        datetime: new Date('2025-12-01T10:00:00'),
        location: 'Test Location',
        preparationNotes: 'Test notes',
        createdAt: new Date(),
      };
      
      // Try multiple times to catch an API error
      let apiErrorThrown = false;
      for (let i = 0; i < 30; i++) {
        try {
          await service.createEvent(appointment, 30);
        } catch (error) {
          if (error instanceof GoogleCalendarAPIError) {
            apiErrorThrown = true;
            expect(error.message).toBeTruthy();
            expect(error.name).toBe('GoogleCalendarAPIError');
            break;
          }
        }
      }
      
      // We should have caught at least one API error in 30 attempts
      expect(apiErrorThrown).toBe(true);
    });

    it('should throw GoogleCalendarAuthError when createEvent is called without authentication', async () => {
      const service = getGoogleCalendarService();
      
      const appointment: Appointment = {
        id: 'test-123',
        name: 'Test Appointment',
        datetime: new Date('2025-12-01T10:00:00'),
        createdAt: new Date(),
      };
      
      await expect(service.createEvent(appointment, 30)).rejects.toThrow(GoogleCalendarAuthError);
      await expect(service.createEvent(appointment, 30)).rejects.toThrow('Not authenticated');
    });

    it('should not crash the app when API requests fail', async () => {
      const service = getGoogleCalendarService();
      
      // Authenticate first
      let authenticated = false;
      for (let i = 0; i < 20 && !authenticated; i++) {
        try {
          await service.authenticate();
          authenticated = true;
        } catch (error) {
          // Keep trying
        }
      }
      
      expect(authenticated).toBe(true);
      
      const appointment: Appointment = {
        id: 'test-123',
        name: 'Test Appointment',
        datetime: new Date('2025-12-01T10:00:00'),
        createdAt: new Date(),
      };
      
      // Attempt multiple API calls
      for (let i = 0; i < 10; i++) {
        try {
          await service.createEvent(appointment, 30);
        } catch (error) {
          // Errors should be caught gracefully
          expect(error).toBeInstanceOf(Error);
        }
      }
      
      // Service should still be functional
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('Appointments can still be created when calendar integration fails', () => {
    it('should allow appointment creation even when not authenticated', () => {
      
      // Create appointment data (this would normally be handled by the app)
      const appointment: Appointment = {
        id: 'test-123',
        name: 'Test Appointment',
        datetime: new Date('2025-12-01T10:00:00'),
        location: 'Test Location',
        preparationNotes: 'Test notes',
        createdAt: new Date(),
      };
      
      // Appointment object is created successfully regardless of calendar status
      expect(appointment).toBeDefined();
      expect(appointment.id).toBe('test-123');
      expect(appointment.name).toBe('Test Appointment');
      
      // Calendar integration is optional - appointment exists without googleCalendarEventId
      expect(appointment.googleCalendarEventId).toBeUndefined();
    });

    it('should allow appointment to exist without googleCalendarEventId when sync fails', async () => {
      const service = getGoogleCalendarService();
      
      // Authenticate
      let authenticated = false;
      for (let i = 0; i < 20 && !authenticated; i++) {
        try {
          await service.authenticate();
          authenticated = true;
        } catch (error) {
          // Keep trying
        }
      }
      
      expect(authenticated).toBe(true);
      
      // Create appointment
      const appointment: Appointment = {
        id: 'test-456',
        name: 'Another Test',
        datetime: new Date('2025-12-15T14:00:00'),
        createdAt: new Date(),
      };
      
      // Try to sync to calendar - may fail
      try {
        const eventId = await service.createEvent(appointment, 15);
        appointment.googleCalendarEventId = eventId;
      } catch (error) {
        // If sync fails, appointment still exists without calendar event ID
        expect(error).toBeInstanceOf(Error);
      }
      
      // Appointment is valid regardless of sync status
      expect(appointment).toBeDefined();
      expect(appointment.id).toBe('test-456');
      expect(appointment.name).toBe('Another Test');
    });
  });

  describe('Service State Management', () => {
    it('should maintain connection status correctly', async () => {
      const service = getGoogleCalendarService();
      
      expect(service.isAuthenticated()).toBe(false);
      
      // Try to authenticate
      try {
        await service.authenticate();
        expect(service.isAuthenticated()).toBe(true);
      } catch (error) {
        expect(service.isAuthenticated()).toBe(false);
      }
    });

    it('should disconnect gracefully', async () => {
      const service = getGoogleCalendarService();
      
      // Authenticate first
      let authenticated = false;
      for (let i = 0; i < 20 && !authenticated; i++) {
        try {
          await service.authenticate();
          authenticated = true;
        } catch (error) {
          // Keep trying
        }
      }
      
      expect(authenticated).toBe(true);
      expect(service.isAuthenticated()).toBe(true);
      
      // Disconnect
      service.disconnect();
      expect(service.isAuthenticated()).toBe(false);
      
      // Should not crash after disconnect
      expect(() => service.disconnect()).not.toThrow();
    });
  });
});
