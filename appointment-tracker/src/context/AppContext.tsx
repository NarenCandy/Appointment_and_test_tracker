import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { loadAppointments, saveAppointments, loadThemePreference, saveThemePreference } from '../services/storageService';

/**
 * Initial state for the application
 */
const initialState: AppState = {
  appointments: [],
  isLoading: false,
  error: null,
  theme: 'light',
  googleCalendarConnected: false,
};

/**
 * Reducer function to handle state updates
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };

    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload),
      };

    case 'MARK_DONE':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload),
      };

    case 'LOAD_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload,
        isLoading: false,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_GOOGLE_CALENDAR_STATUS':
      return {
        ...state,
        googleCalendarConnected: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Context for app state
 */
const AppStateContext = createContext<AppState | undefined>(undefined);

/**
 * Context for dispatch function
 */
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

/**
 * Props for AppProvider
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides state management
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load appointments and theme preference on mount
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Load appointments from localStorage
        const appointments = loadAppointments();
        dispatch({ type: 'LOAD_APPOINTMENTS', payload: appointments });

        // Load theme preference
        const theme = loadThemePreference();
        if (theme) {
          dispatch({ type: 'SET_THEME', payload: theme });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' });
      }
    };

    loadInitialData();
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    try {
      saveAppointments(state.appointments);
    } catch (error) {
      console.error('Failed to save appointments:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save appointments' });
    }
  }, [state.appointments]);

  // Save theme preference whenever it changes
  useEffect(() => {
    try {
      saveThemePreference(state.theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [state.theme]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

/**
 * Custom hook to access app state
 */
export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

/**
 * Custom hook to access dispatch function
 */
export function useAppDispatch(): React.Dispatch<AppAction> {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}
