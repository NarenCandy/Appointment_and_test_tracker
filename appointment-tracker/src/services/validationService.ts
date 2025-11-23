import type { AppointmentFormData, ValidationError } from '../types';

/**
 * Validation service for appointment data
 */

/**
 * Check if a string is non-empty after trimming whitespace
 */
export function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Check if a datetime is in the future
 */
export function isDatetimeInFuture(datetime: Date): boolean {
  const now = new Date();
  return datetime > now;
}

/**
 * Validate appointment form data
 * Returns an array of validation errors (empty if valid)
 */
export function validateAppointment(data: AppointmentFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name - required, non-empty, max 200 characters
  if (!data.name || !isNonEmptyString(data.name)) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  } else if (data.name.trim().length > 200) {
    errors.push({
      field: 'name',
      message: 'Name cannot exceed 200 characters',
    });
  }

  // Validate datetime - required, must be valid date, must be in future
  if (!data.datetime) {
    errors.push({
      field: 'datetime',
      message: 'Please enter a valid date and time',
    });
  } else {
    const datetimeObj = new Date(data.datetime);
    
    // Check if date is valid
    if (isNaN(datetimeObj.getTime())) {
      errors.push({
        field: 'datetime',
        message: 'Please enter a valid date and time',
      });
    } else if (!isDatetimeInFuture(datetimeObj)) {
      errors.push({
        field: 'datetime',
        message: 'Date and time must be in the future',
      });
    }
  }

  // Validate location - optional, max 500 characters
  if (data.location && data.location.length > 500) {
    errors.push({
      field: 'location',
      message: 'Location cannot exceed 500 characters',
    });
  }

  // Validate preparation notes - optional, max 2000 characters
  if (data.preparationNotes && data.preparationNotes.length > 2000) {
    errors.push({
      field: 'preparationNotes',
      message: 'Preparation notes cannot exceed 2000 characters',
    });
  }

  return errors;
}
