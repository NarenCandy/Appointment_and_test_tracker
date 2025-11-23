import type { Appointment } from '../types';

/**
 * Storage service for persisting appointments and preferences to localStorage
 */

const APPOINTMENTS_KEY = 'appointments';
const THEME_KEY = 'theme';

/**
 * Save appointments to localStorage
 */
export function saveAppointments(appointments: Appointment[]): void {
  try {
    // Serialize appointments to JSON
    const serialized = JSON.stringify(appointments);
    localStorage.setItem(APPOINTMENTS_KEY, serialized);
  } catch (error) {
    console.error('Failed to save appointments to localStorage:', error);
    throw new Error('Unable to save appointments. Storage may be full or unavailable.');
  }
}

/**
 * Load appointments from localStorage
 * Returns empty array if no data exists or if data is corrupted
 */
export function loadAppointments(): Appointment[] {
  try {
    const serialized = localStorage.getItem(APPOINTMENTS_KEY);
    
    if (!serialized) {
      return [];
    }

    const parsed = JSON.parse(serialized);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.error('Stored appointments data is not an array');
      return [];
    }

    // Deserialize dates from ISO strings to Date objects
    const appointments: Appointment[] = parsed.map((item: any) => ({
      ...item,
      datetime: new Date(item.datetime),
      createdAt: new Date(item.createdAt),
    }));

    return appointments;
  } catch (error) {
    console.error('Failed to load appointments from localStorage:', error);
    console.warn('Unable to load saved appointments. Starting fresh.');
    return [];
  }
}

/**
 * Clear all appointments from localStorage
 */
export function clearAppointments(): void {
  try {
    localStorage.removeItem(APPOINTMENTS_KEY);
  } catch (error) {
    console.error('Failed to clear appointments from localStorage:', error);
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference to localStorage:', error);
  }
}

/**
 * Load theme preference from localStorage
 * Returns null if no preference is saved
 */
export function loadThemePreference(): 'light' | 'dark' | null {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load theme preference from localStorage:', error);
    return null;
  }
}
