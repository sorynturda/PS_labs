package com.medcare.controller;

import com.medcare.dto.AppointmentRequest;
import com.medcare.model.Appointment;
import com.medcare.service.ReceptionistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('RECEPTIONIST')")
public class ReceptionistController {

    private final ReceptionistService receptionistService;

    public ReceptionistController(ReceptionistService receptionistService) {
        this.receptionistService = receptionistService;
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(receptionistService.createAppointment(request));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam Appointment.AppointmentStatus status) {
        return ResponseEntity.ok(receptionistService.updateAppointmentStatus(id, status));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(receptionistService.getAllAppointments());
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(receptionistService.getAppointment(id));
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(receptionistService.getAllDoctors());
    }

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        return ResponseEntity.ok(receptionistService.getAllServices());
    }
} 