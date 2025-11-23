// Core data types for the Appointment Tracker application

export interface Appointment {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Appointment name (required, non-empty)
  datetime: Date;                // Scheduled date and time (required, must be future)
  location?: string;             // Optional location
  preparationNotes?: string;     // Optional preparation instructions
  createdAt: Date;               // Timestamp of creation
  googleCalendarEventId?: string; // Optional Google Calendar event ID
}

export interface AppointmentFormData {
  name: string;
  datetime: string;              // ISO 8601 string for form input
  location: string;
  preparationNotes: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  googleCalendarConnected: boolean;
}

export type AppAction =
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'MARK_DONE'; payload: string }
  | { type: 'LOAD_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_GOOGLE_CALENDAR_STATUS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };
