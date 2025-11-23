import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppState, useAppDispatch } from './AppContext';
import { Appointment } from '../types';

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppProvider,
    });

    expect(result.current.appointments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.theme).toBe('light');
    expect(result.current.googleCalendarConnected).toBe(false);
  });

  it('should add appointment', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider }
    );

    const appointment: Appointment = {
      id: '123',
      name: 'Test Appointment',
      datetime: new Date('2025-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    act(() => {
      result.current.dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    });

    expect(result.current.state.appointments).toHaveLength(1);
    expect(result.current.state.appointments[0].id).toBe('123');
  });

  it('should delete appointment', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider }
    );

    const appointment: Appointment = {
      id: '123',
      name: 'Test Appointment',
      datetime: new Date('2025-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    act(() => {
      result.current.dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    });

    expect(result.current.state.appointments).toHaveLength(1);

    act(() => {
      result.current.dispatch({ type: 'DELETE_APPOINTMENT', payload: '123' });
    });

    expect(result.current.state.appointments).toHaveLength(0);
  });

  it('should mark appointment as done', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider }
    );

    const appointment: Appointment = {
      id: '123',
      name: 'Test Appointment',
      datetime: new Date('2025-12-01T10:00:00Z'),
      createdAt: new Date(),
    };

    act(() => {
      result.current.dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    });

    expect(result.current.state.appointments).toHaveLength(1);

    act(() => {
      result.current.dispatch({ type: 'MARK_DONE', payload: '123' });
    });

    expect(result.current.state.appointments).toHaveLength(0);
  });

  it('should set theme', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider }
    );

    expect(result.current.state.theme).toBe('light');

    act(() => {
      result.current.dispatch({ type: 'SET_THEME', payload: 'dark' });
    });

    expect(result.current.state.theme).toBe('dark');
  });

  it('should set error', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider }
    );

    expect(result.current.state.error).toBeNull();

    act(() => {
      result.current.dispatch({ type: 'SET_ERROR', payload: 'Test error' });
    });

    expect(result.current.state.error).toBe('Test error');
  });

  it('should throw error when useAppState is used outside provider', () => {
    expect(() => {
      renderHook(() => useAppState());
    }).toThrow('useAppState must be used within an AppProvider');
  });

  it('should throw error when useAppDispatch is used outside provider', () => {
    expect(() => {
      renderHook(() => useAppDispatch());
    }).toThrow('useAppDispatch must be used within an AppProvider');
  });
});
