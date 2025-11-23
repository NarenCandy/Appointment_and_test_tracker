import React, { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { validateAppointment } from '../services/validationService';
import type { AppointmentFormData, ValidationError, Appointment } from '../types';

/**
 * Form component for creating new appointments
 */
export function AppointmentForm() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    datetime: '',
    location: '',
    preparationNotes: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateAppointment(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create appointment object
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      datetime: new Date(formData.datetime),
      location: formData.location.trim() || undefined,
      preparationNotes: formData.preparationNotes.trim() || undefined,
      createdAt: new Date(),
    };

    // Dispatch action to add appointment
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });

    // Clear form
    setFormData({
      name: '',
      datetime: '',
      location: '',
      preparationNotes: '',
    });
    setErrors([]);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find((e) => e.field === fieldName);
    return error?.message;
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="appointment-form"
      aria-label="Add new appointment form"
      noValidate
    >
      <div className="form-group">
        <label htmlFor="name">
          Appointment Name <span className="required" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={getFieldError('name') ? 'error' : ''}
          placeholder="e.g., Annual Physical"
          aria-required="true"
          aria-invalid={!!getFieldError('name')}
          aria-describedby={getFieldError('name') ? 'name-error' : undefined}
        />
        {getFieldError('name') && (
          <span id="name-error" className="error-message" role="alert">
            {getFieldError('name')}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="datetime">
          Date & Time <span className="required" aria-label="required">*</span>
        </label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          className={getFieldError('datetime') ? 'error' : ''}
          aria-required="true"
          aria-invalid={!!getFieldError('datetime')}
          aria-describedby={getFieldError('datetime') ? 'datetime-error' : undefined}
        />
        {getFieldError('datetime') && (
          <span id="datetime-error" className="error-message" role="alert">
            {getFieldError('datetime')}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={getFieldError('location') ? 'error' : ''}
          placeholder="e.g., Main Street Clinic"
          aria-invalid={!!getFieldError('location')}
          aria-describedby={getFieldError('location') ? 'location-error' : undefined}
        />
        {getFieldError('location') && (
          <span id="location-error" className="error-message" role="alert">
            {getFieldError('location')}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="preparationNotes">Preparation Notes</label>
        <textarea
          id="preparationNotes"
          name="preparationNotes"
          value={formData.preparationNotes}
          onChange={handleChange}
          className={getFieldError('preparationNotes') ? 'error' : ''}
          placeholder="e.g., Fasting required - no food 8 hours before"
          rows={4}
          aria-invalid={!!getFieldError('preparationNotes')}
          aria-describedby={getFieldError('preparationNotes') ? 'preparationNotes-error' : undefined}
        />
        {getFieldError('preparationNotes') && (
          <span id="preparationNotes-error" className="error-message" role="alert">
            {getFieldError('preparationNotes')}
          </span>
        )}
      </div>

      <button type="submit" className="submit-button">
        Add Appointment
      </button>
    </form>
  );
}
