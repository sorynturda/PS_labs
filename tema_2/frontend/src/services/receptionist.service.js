// src/services/receptionist.service.js
import axios from '../utils/axiosConfig';

const ReceptionistService = {
  // Appointment Management
  createAppointment: async (appointmentData) => {
    const response = await axios.post('/receptionist/appointments', appointmentData);
    return response.data;
  },
  
  updateAppointmentStatus: async (id, status) => {
    const response = await axios.put(`/receptionist/appointments/${id}/status?status=${status}`);
    return response.data;
  },
  
  getAllAppointments: async () => {
    const response = await axios.get('/receptionist/appointments');
    return response.data;
  },
  
  getAppointment: async (id) => {
    const response = await axios.get(`/receptionist/appointments/${id}`);
    return response.data;
  },
  
  // Get available doctors
  getAllDoctors: async () => {
    const response = await axios.get('/receptionist/doctors');
    return response.data;
  },
  
  // Get available services
  getAllServices: async () => {
    const response = await axios.get('/receptionist/services');
    return response.data;
  }
};

export default ReceptionistService;