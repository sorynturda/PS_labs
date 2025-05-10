import axios from 'axios';
import { LoginRequest, AppointmentRequest, User, Doctor, MedicalService, Appointment, RegisterRequest } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auth endpoints
export const login = (username: string, password: string) =>
    api.post('/auth/login', { username, password });

export const register = (userData: any) =>
    api.post('/auth/register', userData);

// Admin endpoints
export const createReceptionist = (receptionistData: any) =>
    api.post('/admin/users', receptionistData);

export const getAllReceptionists = () =>
    api.get('/admin/users');

export const createDoctor = (doctorData: any) =>
    api.post('/admin/doctors', doctorData);

export const updateDoctor = (id: number, doctorData: any) =>
    api.put(`/admin/doctors/${id}`, doctorData);

export const deleteDoctor = (id: number) =>
    api.delete(`/admin/doctors/${id}`);

export const getAllDoctors = () =>
    api.get('/admin/doctors');

export const createService = (serviceData: any) =>
    api.post('/admin/services', serviceData);

export const updateService = (id: number, serviceData: any) =>
    api.put(`/admin/services/${id}`, serviceData);

export const deleteService = (id: number) =>
    api.delete(`/admin/services/${id}`);

export const getAllServices = () =>
    api.get('/admin/services');

// Receptionist endpoints
export const createAppointment = (appointmentData: any) =>
    api.post('/receptionist/appointments', appointmentData);

export const updateAppointmentStatus = (id: number, status: string) =>
    api.put(`/receptionist/appointments/${id}/status?status=${status}`);

export const getAllAppointments = () =>
    api.get('/receptionist/appointments');

export const getAppointment = (id: number) =>
    api.get(`/receptionist/appointments/${id}`);

export const getReceptionistDoctors = (id: number) =>
    api.get(`/receptionist/doctors/${id}`);

export const getReceptionistServices = (id: number) =>
    api.get(`/receptionist/services/${id}`);

export { api }; 