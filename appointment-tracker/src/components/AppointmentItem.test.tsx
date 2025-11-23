import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppointmentItem } from './AppointmentItem';
import { AppProvider } from '../context/AppContext';
import { Appointment } from '../types';

describe('AppointmentItem', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderItem = (appointment: Appointment) => {
    return render(
      <AppProvider>
        <AppointmentItem appointment={appointment} />
      </AppProvider>
    );
  };

  it('should display appointment name', () => {
    const appointment: Appointment = {
      id: '1',
      name: 'Annual Physical',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    expect(screen.getByText('Annual Physical')).toBeInTheDocument();
  });

  it('should display formatted datetime', () => {
    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    // Check that some date text is displayed (format may vary by locale)
    expect(screen.getByText(/Dec|12|2030/)).toBeInTheDocument();
  });

  it('should display location when provided', () => {
    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      location: 'Main Street Clinic',
      createdAt: new Date(),
    };

    renderItem(appointment);
    expect(screen.getByText(/Main Street Clinic/)).toBeInTheDocument();
  });

  it('should not display location when not provided', () => {
    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    expect(screen.queryByText(/📍/)).not.toBeInTheDocument();
  });

  it('should display truncated preparation notes', () => {
    const longNotes = 'a'.repeat(150);
    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      preparationNotes: longNotes,
      createdAt: new Date(),
    };

    renderItem(appointment);
    // Look for the truncated text with ellipsis
    const truncatedText = longNotes.substring(0, 100) + '...';
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
  });

  it('should apply past styling for past appointments', () => {
    const pastAppointment: Appointment = {
      id: '1',
      name: 'Past Appointment',
      datetime: new Date('2020-01-01T10:00:00Z'),
      createdAt: new Date(),
    };

    const { container } = renderItem(pastAppointment);
    const itemElement = container.querySelector('.appointment-item');
    expect(itemElement).toHaveClass('past');
  });

  it('should not apply past styling for future appointments', () => {
    const futureAppointment: Appointment = {
      id: '1',
      name: 'Future Appointment',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    const { container } = renderItem(futureAppointment);
    const itemElement = container.querySelector('.appointment-item');
    expect(itemElement).not.toHaveClass('past');
  });

  it('should show confirmation dialog when marking as done', () => {
    const confirmMock = vi.fn().mockReturnValue(false);
    window.confirm = confirmMock;

    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    const doneButton = screen.getByRole('button', { name: /mark.*test.*as done/i });
    fireEvent.click(doneButton);

    expect(confirmMock).toHaveBeenCalledWith(
      'Mark this appointment as done? This will remove it from your list.'
    );
  });

  it('should show confirmation dialog when deleting', () => {
    const confirmMock = vi.fn().mockReturnValue(false);
    window.confirm = confirmMock;

    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    const deleteButton = screen.getByRole('button', { name: /delete.*test/i });
    fireEvent.click(deleteButton);

    expect(confirmMock).toHaveBeenCalledWith(
      'Permanently delete this appointment? This action cannot be undone.'
    );
  });

  it('should have mark done and delete buttons', () => {
    const appointment: Appointment = {
      id: '1',
      name: 'Test',
      datetime: new Date('2030-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    renderItem(appointment);
    expect(screen.getByRole('button', { name: /mark.*test.*as done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete.*test/i })).toBeInTheDocument();
  });
});
