// src/services/admin.service.js
import axios from '../utils/axiosConfig';

const AdminService = {
  // User (Receptionist) Management
  createReceptionist: async (userData) => {
    const response = await axios.post('/admin/users', userData);
    return response.data;
  },
  
  getAllReceptionists: async () => {
    const response = await axios.get('/admin/users');
    return response.data;
  },
  
  // Doctor Management
  createDoctor: async (doctorData) => {
    const response = await axios.post('/admin/doctors', doctorData);
    return response.data;
  },
  
  updateDoctor: async (id, doctorData) => {
    const response = await axios.put(`/admin/doctors/${id}`, doctorData);
    return response.data;
  },
  
  deleteDoctor: async (id) => {
    const response = await axios.delete(`/admin/doctors/${id}`);
    return response.data;
  },
  
  getAllDoctors: async () => {
    const response = await axios.get('/admin/doctors');
    return response.data;
  },
  
  // Medical Service Management
  createService: async (serviceData) => {
    const response = await axios.post('/admin/services', serviceData);
    return response.data;
  },
  
  updateService: async (id, serviceData) => {
    const response = await axios.put(`/admin/services/${id}`, serviceData);
    return response.data;
  },
  
  deleteService: async (id) => {
    const response = await axios.delete(`/admin/services/${id}`);
    return response.data;
  },
  
  getAllServices: async () => {
    const response = await axios.get('/admin/services');
    return response.data;
  },
  
  // Format date to ISO_DATE_TIME
  formatDateToISODateTime: (dateStr) => {
    // Ensure we have a valid date string
    if (!dateStr) return '';
    
    // If it's already in ISO format with time, return as is
    if (dateStr.includes('T')) return dateStr;
    
    // Otherwise add time component
    return `${dateStr}T00:00:00`;
  },
  
  // Reports
  getAppointmentsReport: async (startDate, endDate) => {
    const formattedStartDate = AdminService.formatDateToISODateTime(startDate);
    // For the end date, use end of day
    const formattedEndDate = endDate ? `${endDate}T23:59:59` : '';
    
    const response = await axios.get(`/admin/reports/appointments?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
    return response.data.appointments || [];
  },
  
  getDoctorsReport: async (startDate, endDate) => {
    const formattedStartDate = AdminService.formatDateToISODateTime(startDate);
    // For the end date, use end of day
    const formattedEndDate = endDate ? `${endDate}T23:59:59` : '';
    
    const response = await axios.get(`/admin/reports/doctors?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
    return response.data.doctorStats || [];
  },
  
  getServicesReport: async (startDate, endDate) => {
    const formattedStartDate = AdminService.formatDateToISODateTime(startDate);
    // For the end date, use end of day
    const formattedEndDate = endDate ? `${endDate}T23:59:59` : '';
    
    const response = await axios.get(`/admin/reports/services?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
    return response.data.serviceStats || [];
  }
};

export default AdminService;