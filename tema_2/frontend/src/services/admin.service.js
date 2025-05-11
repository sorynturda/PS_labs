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
  
  // Reports
  getAppointmentsReport: async (startDate, endDate) => {
    const response = await axios.get(`/admin/reports/appointments?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  
  getDoctorsReport: async (startDate, endDate) => {
    const response = await axios.get(`/admin/reports/doctors?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  
  getServicesReport: async (startDate, endDate) => {
    const response = await axios.get(`/admin/reports/services?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }
};

export default AdminService;