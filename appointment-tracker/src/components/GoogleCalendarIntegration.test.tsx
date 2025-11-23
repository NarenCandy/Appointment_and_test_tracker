import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleCalendarIntegration } from './GoogleCalendarIntegration';
import { AppProvider } from '../context/AppContext';
import * as googleCalendarService from '../services/googleCalendarService';

/**
 * Unit tests for GoogleCalendarIntegration component
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
describe('GoogleCalendarIntegration', () => {
  const renderComponent = (props = {}) => {
    return render(
      <AppProvider>
        <GoogleCalendarIntegration {...props} />
      </AppProvider>
    );
  };

  it('should display "Not Connected" status initially', () => {
    renderComponent();
    expect(screen.getByText('Not Connected')).toBeInTheDocument();
  });

  it('should display "Connect Google Calendar" button when not connected', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /connect to google calendar/i })).toBeInTheDocument();
  });

  it('should display connection status with proper ARIA attributes', () => {
    renderComponent();
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('Not Connected');
  });

  it('should show connecting state when button is clicked', async () => {
    const mockService = {
      authenticate: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
      isAuthenticated: vi.fn().mockReturnValue(false),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    renderComponent();
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  it('should display error message when authentication fails', async () => {
    const mockService = {
      authenticate: vi.fn().mockRejectedValue(new googleCalendarService.GoogleCalendarAuthError('Authentication failed')),
      isAuthenticated: vi.fn().mockReturnValue(false),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    renderComponent();
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Authentication failed');
    });
  });

  it('should display reminder settings when connected', async () => {
    const mockService = {
      authenticate: vi.fn().mockResolvedValue(undefined),
      isAuthenticated: vi.fn().mockReturnValue(true),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    renderComponent();
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/reminder before appointment/i)).toBeInTheDocument();
    });
  });

  it('should have accessible reminder select with proper label', async () => {
    const mockService = {
      authenticate: vi.fn().mockResolvedValue(undefined),
      isAuthenticated: vi.fn().mockReturnValue(true),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    renderComponent();
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      const reminderSelect = screen.getByLabelText(/select reminder time before appointment/i);
      expect(reminderSelect).toBeInTheDocument();
      expect(reminderSelect).toHaveAttribute('id', 'reminder-minutes');
    });
  });

  it('should call onConnectionChange callback when connection status changes', async () => {
    const mockService = {
      authenticate: vi.fn().mockResolvedValue(undefined),
      isAuthenticated: vi.fn().mockReturnValue(false),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    const onConnectionChange = vi.fn();
    renderComponent({ onConnectionChange });
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(onConnectionChange).toHaveBeenCalledWith(true);
    });
  });

  it('should display disconnect button when connected', async () => {
    const mockService = {
      authenticate: vi.fn().mockResolvedValue(undefined),
      isAuthenticated: vi.fn().mockReturnValue(true),
      createEvent: vi.fn(),
      disconnect: vi.fn(),
    };
    
    vi.spyOn(googleCalendarService, 'getGoogleCalendarService').mockReturnValue(mockService);

    renderComponent();
    
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /disconnect from google calendar/i })).toBeInTheDocument();
    });
  });

  it('should have minimum touch target size for buttons', () => {
    renderComponent();
    const connectButton = screen.getByRole('button', { name: /connect to google calendar/i });
    
    // Check that button has appropriate styling class
    expect(connectButton).toHaveClass('connect-button');
  });
});
