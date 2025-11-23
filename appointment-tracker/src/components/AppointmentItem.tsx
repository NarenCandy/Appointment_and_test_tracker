import { memo } from 'react';
import type { Appointment } from '../types';
import { isPastAppointment } from '../utils/appointmentUtils';
import { useAppDispatch } from '../context/AppContext';

interface AppointmentItemProps {
  appointment: Appointment;
}

/**
 * Component for displaying a single appointment
 * Memoized to prevent unnecessary re-renders when appointment data hasn't changed
 */
const AppointmentItemComponent = ({ appointment }: AppointmentItemProps) => {
  const dispatch = useAppDispatch();
  const isPast = isPastAppointment(appointment);

  const handleMarkDone = () => {
    if (window.confirm('Mark this appointment as done? This will remove it from your list.')) {
      dispatch({ type: 'MARK_DONE', payload: appointment.id });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Permanently delete this appointment? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_APPOINTMENT', payload: appointment.id });
    }
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article 
      className={`appointment-item ${isPast ? 'past' : ''}`}
      aria-label={`Appointment: ${appointment.name}`}
    >
      <div className="appointment-content">
        <h3 className="appointment-name">{appointment.name}</h3>
        <p className="appointment-datetime">
          <time dateTime={appointment.datetime.toISOString()}>
            {formatDateTime(appointment.datetime)}
          </time>
        </p>
        {appointment.location && (
          <p className="appointment-location">
            <span aria-hidden="true">📍 </span>
            <span className="visually-hidden">Location: </span>
            {appointment.location}
          </p>
        )}
        {appointment.preparationNotes && (
          <p className="appointment-notes">
            <span aria-hidden="true">📝 </span>
            <span className="visually-hidden">Preparation notes: </span>
            {truncateText(appointment.preparationNotes, 100)}
          </p>
        )}
      </div>
      <div className="appointment-actions" role="group" aria-label="Appointment actions">
        <button
          onClick={handleMarkDone}
          className="btn-mark-done"
          aria-label={`Mark ${appointment.name} as done`}
          type="button"
        >
          <span aria-hidden="true">✓</span> Done
        </button>
        <button
          onClick={handleDelete}
          className="btn-delete"
          aria-label={`Delete ${appointment.name}`}
          type="button"
        >
          <span aria-hidden="true">🗑</span> Delete
        </button>
      </div>
    </article>
  );
};

/**
 * Memoized AppointmentItem component
 * Only re-renders when appointment.id or appointment data changes
 */
export const AppointmentItem = memo(AppointmentItemComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if appointment data actually changed
  return (
    prevProps.appointment.id === nextProps.appointment.id &&
    prevProps.appointment.name === nextProps.appointment.name &&
    prevProps.appointment.datetime.getTime() === nextProps.appointment.datetime.getTime() &&
    prevProps.appointment.location === nextProps.appointment.location &&
    prevProps.appointment.preparationNotes === nextProps.appointment.preparationNotes
  );
});
