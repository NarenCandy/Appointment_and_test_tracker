import type { Appointment } from '../types';
import { AppointmentItem } from './AppointmentItem';

interface AppointmentListProps {
  appointments?: Appointment[];
}

/**
 * Component for displaying a list of appointments
 * Accepts appointments as a prop (already sorted and filtered)
 */
export function AppointmentList({ appointments = [] }: AppointmentListProps) {
  const sortedAppointments = appointments;

  // Display empty state when no appointments exist
  if (sortedAppointments.length === 0) {
    return (
      <div className="appointment-list-empty" role="status" aria-live="polite">
        <p>No appointments scheduled. Add your first appointment above!</p>
      </div>
    );
  }

  // Map appointments to AppointmentItem components
  return (
    <div 
      className="appointment-list" 
      role="region" 
      aria-label="List of appointments"
      aria-live="polite"
    >
      {sortedAppointments.map((appointment) => (
        <AppointmentItem key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
