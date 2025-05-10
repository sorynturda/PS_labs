export interface User {
    id: number;
    fullName: string;
    username: string;
    role: 'ADMIN' | 'RECEPTIONIST';
}

export interface Doctor {
    id?: number;
    name: string;
    specialization: string;
    startTime: string;
    endTime: string;
    active: boolean;
}

export interface MedicalService {
    id?: number;
    name: string;
    price: number;
    duration: string;
    active: boolean;
}

export interface Appointment {
    id: number;
    patientName: string;
    doctor: Doctor;
    service: MedicalService;
    appointmentTime: string;
    status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    createdBy: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AppointmentRequest {
    patientName: string;
    doctorId: number;
    serviceId: number;
    appointmentTime: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    fullName: string;
    role: 'ADMIN' | 'RECEPTIONIST';
} 