import type { Appointment } from '../types';

/**
 * Sort appointments by datetime in ascending order (earliest first)
 */
export function sortAppointmentsByDatetime(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
}

/**
 * Check if an appointment's datetime has passed
 */
export function isPastAppointment(appointment: Appointment): boolean {
  const now = new Date();
  return appointment.datetime < now;
}

/**
 * Filter appointments by keyword (searches name, location, and preparation notes)
 * Case-insensitive search
 */
export function filterByKeyword(appointments: Appointment[], keyword: string): Appointment[] {
  if (!keyword || keyword.trim().length === 0) {
    return appointments;
  }

  const lowerKeyword = keyword.toLowerCase();

  return appointments.filter((appointment) => {
    const nameMatch = appointment.name.toLowerCase().includes(lowerKeyword);
    const locationMatch = appointment.location?.toLowerCase().includes(lowerKeyword) || false;
    const notesMatch = appointment.preparationNotes?.toLowerCase().includes(lowerKeyword) || false;

    return nameMatch || locationMatch || notesMatch;
  });
}

/**
 * Filter appointments by date range (inclusive)
 */
export function filterByDateRange(
  appointments: Appointment[],
  startDate: Date | null,
  endDate: Date | null
): Appointment[] {
  return appointments.filter((appointment) => {
    const appointmentTime = appointment.datetime.getTime();

    // If start date is provided, check if appointment is on or after start date
    if (startDate) {
      const startTime = startDate.getTime();
      if (appointmentTime < startTime) {
        return false;
      }
    }

    // If end date is provided, check if appointment is on or before end date
    if (endDate) {
      const endTime = endDate.getTime();
      if (appointmentTime > endTime) {
        return false;
      }
    }

    return true;
  });
}
