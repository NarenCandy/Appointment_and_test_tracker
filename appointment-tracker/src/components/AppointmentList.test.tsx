import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppointmentList } from './AppointmentList';
import { AppProvider } from '../context/AppContext';

describe('AppointmentList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display empty state message when appointments array is empty', () => {
    render(
      <AppProvider>
        <AppointmentList />
      </AppProvider>
    );

    expect(screen.getByText(/no appointments/i)).toBeInTheDocument();
  });
});
