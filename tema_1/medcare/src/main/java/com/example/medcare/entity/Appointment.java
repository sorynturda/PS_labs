package com.example.medcare.entity;

import com.example.medcare.util.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="patient_name", nullable = false)
    private String patientName;
    @ManyToOne
    @JoinColumn(name = "doctors_id")
    private Doctor doctors;
    @Column(name = "date_", nullable = false)
    private Date date_;
    @ManyToOne
    @JoinColumn(name = "service_id")
    private MedicalService service;
    @Column(name = "status", nullable = false)
    private String status=String.valueOf(AppointmentStatus.NEW);

}
