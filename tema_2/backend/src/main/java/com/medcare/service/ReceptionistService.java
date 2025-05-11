package com.medcare.service;

import com.medcare.dto.AppointmentRequest;
import com.medcare.model.*;
import com.medcare.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReceptionistService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final UserRepository userRepository;

    public ReceptionistService(AppointmentRepository appointmentRepository,
                             DoctorRepository doctorRepository,
                             MedicalServiceRepository medicalServiceRepository,
                             UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.medicalServiceRepository = medicalServiceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        MedicalService service = medicalServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check doctor availability
        LocalDateTime appointmentEnd = request.getAppointmentTime().plus(service.getDuration());
        if (appointmentRepository.existsByDoctorAndAppointmentTimeBetween(
                doctor, request.getAppointmentTime(), appointmentEnd)) {
            throw new RuntimeException("Doctor is not available at the requested time");
        }

        // Check if appointment is within doctor's working hours
        if (request.getAppointmentTime().toLocalTime().isBefore(doctor.getStartTime()) ||
            appointmentEnd.toLocalTime().isAfter(doctor.getEndTime())) {
            throw new RuntimeException("Appointment time is outside doctor's working hours");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User createdBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Appointment appointment = new Appointment();
        appointment.setPatientName(request.getPatientName());
        appointment.setDoctor(doctor);
        appointment.setService(service);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus(Appointment.AppointmentStatus.NEW);
        appointment.setCreatedBy(createdBy);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long id, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    public List<MedicalService> getAllServices() {
        return medicalServiceRepository.findByActiveTrue();
    }
} 