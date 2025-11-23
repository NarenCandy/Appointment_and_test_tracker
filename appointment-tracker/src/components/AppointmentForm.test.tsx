import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppointmentForm } from './AppointmentForm';
import { AppProvider } from '../context/AppContext';

describe('AppointmentForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderForm = () => {
    return render(
      <AppProvider>
        <AppointmentForm />
      </AppProvider>
    );
  };

  it('should render all form fields', () => {
    renderForm();

    expect(screen.getByLabelText(/appointment name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date & time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preparation notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add appointment/i })).toBeInTheDocument();
  });

  it('should display validation error for empty name', async () => {
    renderForm();

    const submitButton = screen.getByRole('button', { name: /add appointment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error for past datetime', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/appointment name/i);
    const datetimeInput = screen.getByLabelText(/date & time/i);
    const submitButton = screen.getByRole('button', { name: /add appointment/i });

    fireEvent.change(nameInput, { target: { value: 'Test Appointment' } });
    fireEvent.change(datetimeInput, { target: { value: '2020-01-01T10:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date and time must be in the future/i)).toBeInTheDocument();
    });
  });

  it('should clear form after successful submission', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/appointment name/i) as HTMLInputElement;
    const datetimeInput = screen.getByLabelText(/date & time/i) as HTMLInputElement;
    const locationInput = screen.getByLabelText(/location/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /add appointment/i });

    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'Test Appointment' } });
    fireEvent.change(datetimeInput, { target: { value: '2030-12-01T10:00' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(datetimeInput.value).toBe('');
      expect(locationInput.value).toBe('');
    });
  });

  it('should update form state on input change', () => {
    renderForm();

    const nameInput = screen.getByLabelText(/appointment name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'New Appointment' } });

    expect(nameInput.value).toBe('New Appointment');
  });

  it('should display multiple validation errors', async () => {
    renderForm();

    const submitButton = screen.getByRole('button', { name: /add appointment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid date and time/i)).toBeInTheDocument();
    });
  });

  it('should clear validation errors on successful submission', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/appointment name/i);
    const datetimeInput = screen.getByLabelText(/date & time/i);
    const submitButton = screen.getByRole('button', { name: /add appointment/i });

    // First submit with invalid data
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Now fill with valid data and submit
    fireEvent.change(nameInput, { target: { value: 'Test Appointment' } });
    fireEvent.change(datetimeInput, { target: { value: '2030-12-01T10:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });
});
