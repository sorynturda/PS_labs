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
 * Format a time string to 24-hour format
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {string} Formatted time string in 24-hour format
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Extract hours and minutes from time string (HH:MM:SS)
  const [hours, minutes] = timeString.split(':');
  
  // Return in 24-hour format
  return `${hours}:${minutes}`;
};

/**
 * Format a datetime string to a human-readable format with 24-hour time
 * @param {string} dateTimeString - Datetime string in ISO format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  // Format date
  const formattedDate = date.toLocaleDateString();
  
  // Format time in 24-hour format
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  
  return `${formattedDate} ${formattedTime}`;
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
 * Parse ISO-8601 duration to minutes
 * @param {string} duration - Duration string in ISO-8601 format (e.g. PT1H30M)
 * @returns {number} Duration in minutes
 */
export const parseDuration = (duration) => {
  if (!duration) return 0;
  
  // Handle PT1H30M format
  if (typeof duration === 'string' && duration.startsWith('PT')) {
    let minutes = 0;
    
    // Extract hours
    const hoursMatch = duration.match(/(\d+)H/);
    if (hoursMatch) {
      minutes += parseInt(hoursMatch[1]) * 60;
    }
    
    // Extract minutes
    const minutesMatch = duration.match(/(\d+)M/);
    if (minutesMatch) {
      minutes += parseInt(minutesMatch[1]);
    }
    
    return minutes;
  }
  
  // Handle object format with seconds
  if (typeof duration === 'object' && duration.seconds !== undefined) {
    return Math.floor(duration.seconds / 60);
  }
  
  // Handle numeric seconds format
  if (!isNaN(Number(duration))) {
    return Math.floor(Number(duration) / 60);
  }
  
  return 0;
};

/**
 * Format minutes to readable duration text
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration text
 */
export const formatDurationText = (minutes) => {
  if (!minutes) return 'Not set';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  }
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
 * Format minutes to ISO-8601 duration format
 * @param {number} minutes - Duration in minutes
 * @returns {string} ISO-8601 duration string (e.g. PT1H30M)
 */
export const minutesToISODuration = (minutes) => {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  let duration = 'PT';
  if (hours > 0) {
    duration += `${hours}H`;
  }
  if (mins > 0) {
    duration += `${mins}M`;
  }
  
  return duration;
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
    const appointmentServiceDuration = parseDuration(appointment.service.duration);
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