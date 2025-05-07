package com.medcare.controller;

import com.medcare.model.Doctor;
import com.medcare.model.MedicalService;
import com.medcare.model.User;
import com.medcare.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // User Management
    @PostMapping("/users")
    public ResponseEntity<?> createReceptionist(@Valid @RequestBody User user) {
        return ResponseEntity.ok(adminService.createReceptionist(user));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllReceptionists() {
        return ResponseEntity.ok(adminService.getAllReceptionists());
    }

    // Doctor Management
    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@Valid @RequestBody Doctor doctor) {
        return ResponseEntity.ok(adminService.createDoctor(doctor));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @Valid @RequestBody Doctor doctor) {
        return ResponseEntity.ok(adminService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    // Medical Service Management
    @PostMapping("/services")
    public ResponseEntity<?> createService(@Valid @RequestBody MedicalService service) {
        return ResponseEntity.ok(adminService.createService(service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @Valid @RequestBody MedicalService service) {
        return ResponseEntity.ok(adminService.updateService(id, service));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        adminService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/services")
    public ResponseEntity<List<MedicalService>> getAllServices() {
        return ResponseEntity.ok(adminService.getAllServices());
    }

    // Reports
    @GetMapping("/reports/appointments")
    public ResponseEntity<?> getAppointmentsReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(adminService.getAppointmentsReport(startDate, endDate));
    }

    @GetMapping("/reports/doctors")
    public ResponseEntity<?> getDoctorsReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(adminService.getDoctorsReport(startDate, endDate));
    }

    @GetMapping("/reports/services")
    public ResponseEntity<?> getServicesReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(adminService.getServicesReport(startDate, endDate));
    }
} 