package com.medcare.repository;

import com.medcare.model.Appointment;
import com.medcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndAppointmentTimeBetween(
        Doctor doctor, LocalDateTime start, LocalDateTime end);
    
    boolean existsByDoctorAndAppointmentTimeBetween(
        Doctor doctor, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentTime BETWEEN ?1 AND ?2")
    List<Appointment> findAppointmentsBetweenDates(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a.doctor, COUNT(a) FROM Appointment a WHERE a.appointmentTime BETWEEN ?1 AND ?2 GROUP BY a.doctor ORDER BY COUNT(a) DESC")
    List<Object[]> findMostRequestedDoctors(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a.service, COUNT(a) FROM Appointment a WHERE a.appointmentTime BETWEEN ?1 AND ?2 GROUP BY a.service ORDER BY COUNT(a) DESC")
    List<Object[]> findMostRequestedServices(LocalDateTime start, LocalDateTime end);
} 