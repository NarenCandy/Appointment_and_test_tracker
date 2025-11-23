import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { getGoogleCalendarService, GoogleCalendarAuthError } from '../services/googleCalendarService';
import './GoogleCalendarIntegration.css';

/**
 * Props for GoogleCalendarIntegration component
 */
interface GoogleCalendarIntegrationProps {
  /** Optional callback when connection status changes */
  onConnectionChange?: (connected: boolean) => void;
}

/**
 * GoogleCalendarIntegration component
 * 
 * Provides UI for connecting to Google Calendar and managing calendar integration.
 * Displays connection status, handles authentication, and shows error messages.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export function GoogleCalendarIntegration({ onConnectionChange }: GoogleCalendarIntegrationProps) {
  const { googleCalendarConnected } = useAppState();
  const dispatch = useAppDispatch();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reminderMinutes, setReminderMinutes] = useState<number>(30);

  const calendarService = getGoogleCalendarService();

  /**
   * Handle connecting to Google Calendar
   * Requirements: 6.1, 6.4
   */
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await calendarService.authenticate();
      dispatch({ type: 'SET_GOOGLE_CALENDAR_STATUS', payload: true });
      onConnectionChange?.(true);
    } catch (err) {
      // Handle authentication errors gracefully
      if (err instanceof GoogleCalendarAuthError) {
        setError(err.message);
      } else {
        setError('Unable to connect to Google Calendar. Please try again.');
      }
      dispatch({ type: 'SET_GOOGLE_CALENDAR_STATUS', payload: false });
      onConnectionChange?.(false);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle disconnecting from Google Calendar
   */
  const handleDisconnect = () => {
    calendarService.disconnect();
    dispatch({ type: 'SET_GOOGLE_CALENDAR_STATUS', payload: false });
    setError(null);
    onConnectionChange?.(false);
  };

  /**
   * Handle reminder minutes input change
   */
  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReminderMinutes(Number(e.target.value));
  };

  return (
    <div className="google-calendar-integration">
      <div className="calendar-header">
        <h3>Google Calendar Integration</h3>
        
        {/* Connection status display - Requirements: 6.1 */}
        <div className="connection-status" aria-live="polite">
          {googleCalendarConnected ? (
            <span className="status-connected" role="status">
              <span className="status-indicator connected" aria-hidden="true"></span>
              Connected
            </span>
          ) : (
            <span className="status-disconnected" role="status">
              <span className="status-indicator disconnected" aria-hidden="true"></span>
              Not Connected
            </span>
          )}
        </div>
      </div>

      {/* Error message display - Requirements: 6.4 */}
      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Connection controls */}
      <div className="calendar-controls">
        {!googleCalendarConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="connect-button"
            aria-label="Connect to Google Calendar"
          >
            {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
          </button>
        ) : (
          <>
            <button
              onClick={handleDisconnect}
              className="disconnect-button"
              aria-label="Disconnect from Google Calendar"
            >
              Disconnect
            </button>

            {/* Reminder settings - Requirements: 6.2, 6.3 */}
            <div className="reminder-settings">
              <label htmlFor="reminder-minutes">
                Reminder before appointment:
              </label>
              <select
                id="reminder-minutes"
                value={reminderMinutes}
                onChange={handleReminderChange}
                className="reminder-select"
                aria-label="Select reminder time before appointment"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>1 day</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Information text */}
      <p className="calendar-info">
        {googleCalendarConnected
          ? 'New appointments will be automatically synced to your Google Calendar with the selected reminder time.'
          : 'Connect your Google Calendar to receive reminders and sync appointments across devices.'}
      </p>
    </div>
  );
}

// Export the sync function for use in AppointmentForm
export { GoogleCalendarIntegration as default };
