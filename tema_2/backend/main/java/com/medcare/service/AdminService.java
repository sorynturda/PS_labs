package com.medcare.service;

import com.medcare.model.*;
import com.medcare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserService userService;
    private final DoctorRepository doctorRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminService(UserService userService, DoctorRepository doctorRepository,
                       MedicalServiceRepository medicalServiceRepository,
                       AppointmentRepository appointmentRepository) {
        this.userService = userService;
        this.doctorRepository = doctorRepository;
        this.medicalServiceRepository = medicalServiceRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public User createReceptionist(User user) {
        user.setRole(User.UserRole.RECEPTIONIST);
        return userService.createUser(user);
    }

    public List<User> getAllReceptionists() {
        return userService.getAllReceptionists();
    }

    @Transactional
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Transactional
    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        existingDoctor.setName(doctor.getName());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setStartTime(doctor.getStartTime());
        existingDoctor.setEndTime(doctor.getEndTime());
        
        return doctorRepository.save(existingDoctor);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    @Transactional
    public MedicalService createService(MedicalService service) {
        return medicalServiceRepository.save(service);
    }

    @Transactional
    public MedicalService updateService(Long id, MedicalService service) {
        MedicalService existingService = medicalServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        existingService.setName(service.getName());
        existingService.setPrice(service.getPrice());
        existingService.setDuration(service.getDuration());
        
        return medicalServiceRepository.save(existingService);
    }

    @Transactional
    public void deleteService(Long id) {
        MedicalService service = medicalServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setActive(false);
        medicalServiceRepository.save(service);
    }

    public List<MedicalService> getAllServices() {
        return medicalServiceRepository.findByActiveTrue();
    }

    public Map<String, Object> getAppointmentsReport(String startDate, String endDate) {
        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);
        
        List<Appointment> appointments = appointmentRepository.findAppointmentsBetweenDates(start, end);
        
        return Map.of(
            "totalAppointments", appointments.size(),
            "appointments", appointments
        );
    }

    public Map<String, Object> getDoctorsReport(String startDate, String endDate) {
        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);
        
        List<Object[]> doctorStats = appointmentRepository.findMostRequestedDoctors(start, end);
        
        return Map.of(
            "doctorStats", doctorStats.stream()
                .map(stat -> Map.of(
                    "doctor", stat[0],
                    "appointmentCount", stat[1]
                ))
                .collect(Collectors.toList())
        );
    }

    public Map<String, Object> getServicesReport(String startDate, String endDate) {
        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);
        
        List<Object[]> serviceStats = appointmentRepository.findMostRequestedServices(start, end);
        
        return Map.of(
            "serviceStats", serviceStats.stream()
                .map(stat -> Map.of(
                    "service", stat[0],
                    "appointmentCount", stat[1]
                ))
                .collect(Collectors.toList())
        );
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME);
    }
} 