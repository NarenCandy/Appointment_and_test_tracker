import type { Appointment } from '../types';
import { isPastAppointment } from '../utils/appointmentUtils';

interface PrintableChecklistProps {
  appointments: Appointment[];
}

/**
 * Component for displaying a printer-friendly checklist of upcoming appointments
 * Filters out past appointments and displays full preparation notes
 */
export function PrintableChecklist({ appointments }: PrintableChecklistProps) {
  // Filter appointments to only future appointments
  const futureAppointments = appointments.filter(
    (appointment) => !isPastAppointment(appointment)
  );

  const formatDateTime = (date: Date): string => {
    // Handle invalid dates gracefully
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <article className="printable-checklist" role="article" aria-label="Printable appointment checklist">
      <h1 className="checklist-title">Upcoming Appointments</h1>
      
      {futureAppointments.length === 0 ? (
        <p className="checklist-empty" role="status">No upcoming appointments scheduled.</p>
      ) : (
        <div className="checklist-items" role="list">
          {futureAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="checklist-item"
              role="listitem"
              aria-labelledby={`checklist-name-${appointment.id}`}
            >
              <div className="checklist-checkbox">
                <input 
                  type="checkbox" 
                  id={`checkbox-${appointment.id}`}
                  aria-label={`Mark ${appointment.name} as complete`}
                />
              </div>
              <div className="checklist-content">
                <h2 
                  id={`checklist-name-${appointment.id}`}
                  className="checklist-appointment-name"
                >
                  {appointment.name}
                </h2>
                <p className="checklist-datetime">
                  <strong>Date & Time:</strong>{' '}
                  <time dateTime={appointment.datetime.toISOString()}>
                    {formatDateTime(appointment.datetime)}
                  </time>
                </p>
                {appointment.location && (
                  <p className="checklist-location">
                    <strong>Location:</strong> {appointment.location}
                  </p>
                )}
                {appointment.preparationNotes && (
                  <div className="checklist-notes">
                    <strong>Preparation Notes:</strong>
                    <p>{appointment.preparationNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @media print {
          .printable-checklist {
            font-family: 'Georgia', serif;
            max-width: 100%;
            padding: 20px;
            background: white;
            color: black;
          }
          
          .checklist-title {
            font-size: 24px;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          
          .checklist-items {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .checklist-item {
            display: flex;
            gap: 15px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
          }
          
          .checklist-checkbox {
            flex-shrink: 0;
            padding-top: 5px;
          }
          
          .checklist-checkbox input[type="checkbox"] {
            width: 20px;
            height: 20px;
            border: 2px solid #333;
          }
          
          .checklist-content {
            flex: 1;
          }
          
          .checklist-appointment-name {
            font-size: 18px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }
          
          .checklist-datetime,
          .checklist-location {
            margin: 5px 0;
            font-size: 14px;
          }
          
          .checklist-notes {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-left: 3px solid #666;
          }
          
          .checklist-notes strong {
            display: block;
            margin-bottom: 5px;
          }
          
          .checklist-notes p {
            margin: 0;
            white-space: pre-wrap;
            line-height: 1.6;
          }
          
          .checklist-empty {
            text-align: center;
            padding: 40px;
            font-style: italic;
            color: #666;
          }
        }
        
        @media screen {
          .printable-checklist {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .checklist-title {
            font-size: 28px;
            margin-bottom: 24px;
            color: #2D3748;
            border-bottom: 2px solid #E0E5EC;
            padding-bottom: 12px;
          }
          
          .checklist-items {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .checklist-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            border: 1px solid #E0E5EC;
            border-radius: 8px;
            background: #FFFFFF;
          }
          
          .checklist-checkbox {
            flex-shrink: 0;
            padding-top: 4px;
          }
          
          .checklist-checkbox input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          
          .checklist-content {
            flex: 1;
          }
          
          .checklist-appointment-name {
            font-size: 20px;
            margin: 0 0 12px 0;
            font-weight: 600;
            color: #2D3748;
          }
          
          .checklist-datetime,
          .checklist-location {
            margin: 8px 0;
            font-size: 14px;
            color: #4A5568;
          }
          
          .checklist-notes {
            margin-top: 12px;
            padding: 12px;
            background: #F7FAFC;
            border-left: 3px solid #6C63FF;
            border-radius: 4px;
          }
          
          .checklist-notes strong {
            display: block;
            margin-bottom: 8px;
            color: #2D3748;
            font-size: 14px;
          }
          
          .checklist-notes p {
            margin: 0;
            white-space: pre-wrap;
            line-height: 1.6;
            color: #4A5568;
            font-size: 14px;
          }
          
          .checklist-empty {
            text-align: center;
            padding: 60px 20px;
            font-style: italic;
            color: #718096;
            font-size: 16px;
          }
        }
      `}</style>
    </article>
  );
}
