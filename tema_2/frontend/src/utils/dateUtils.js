// src/utils/dateUtils.js

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format a time string to a human-readable format
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Extract hours and minutes from time string (HH:MM:SS)
  const [hours, minutes] = timeString.split(':');
  
  // Convert to 12-hour format
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format a datetime string to a human-readable format
 * @param {string} dateTimeString - Datetime string in ISO format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  return date.toLocaleString();
};

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns {string} Current date in ISO format
 */
export const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

/**
 * Get current datetime in ISO format (YYYY-MM-DDTHH:MM)
 * @returns {string} Current datetime in ISO format
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Convert minutes to a Duration format for the API
 * @param {number} minutes - Duration in minutes
 * @returns {object} Duration object compatible with backend
 */
export const minutesToDuration = (minutes) => {
  return {
    seconds: minutes * 60
  };
};

/**
 * Check if a time slot is available for an appointment
 * @param {string} dateTimeString - Requested appointment time
 * @param {object} doctor - Doctor object
 * @param {array} appointments - Existing appointments
 * @param {number} serviceDuration - Duration of the service in minutes
 * @returns {boolean} True if the time slot is available
 */
export const isTimeSlotAvailable = (dateTimeString, doctor, appointments, serviceDuration) => {
  if (!dateTimeString || !doctor || !appointments || !serviceDuration) {
    return false;
  }
  
  const requestedDate = new Date(dateTimeString);
  const requestedDay = requestedDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // Check if the requested time is within doctor's working hours
  const requestedHours = requestedDate.getHours();
  const requestedMinutes = requestedDate.getMinutes();
  const requestedTime = requestedHours * 60 + requestedMinutes; // Convert to minutes
  
  const doctorStartHours = parseInt(doctor.startTime.split(':')[0], 10);
  const doctorStartMinutes = parseInt(doctor.startTime.split(':')[1], 10);
  const doctorEndHours = parseInt(doctor.endTime.split(':')[0], 10);
  const doctorEndMinutes = parseInt(doctor.endTime.split(':')[1], 10);
  
  const doctorStartTime = doctorStartHours * 60 + doctorStartMinutes; // Convert to minutes
  const doctorEndTime = doctorEndHours * 60 + doctorEndMinutes; // Convert to minutes
  
  if (requestedTime < doctorStartTime || requestedTime + serviceDuration > doctorEndTime) {
    return false; // Outside doctor's working hours
  }
  
  // Check if the requested time overlaps with existing appointments
  const requestedEndTime = new Date(requestedDate.getTime() + serviceDuration * 60 * 1000);
  
  const doctorAppointments = appointments.filter(app => app.doctor.id === doctor.id);
  
  for (const appointment of doctorAppointments) {
    const appointmentStartTime = new Date(appointment.appointmentTime);
    const appointmentServiceDuration = appointment.service.duration.seconds / 60; // Convert to minutes
    const appointmentEndTime = new Date(appointmentStartTime.getTime() + appointmentServiceDuration * 60 * 1000);
    
    // Check for overlap
    if (
      (requestedDate >= appointmentStartTime && requestedDate < appointmentEndTime) ||
      (requestedEndTime > appointmentStartTime && requestedEndTime <= appointmentEndTime) ||
      (requestedDate <= appointmentStartTime && requestedEndTime >= appointmentEndTime)
    ) {
      return false; // Overlaps with an existing appointment
    }
  }
  
  return true; // Time slot is available
};