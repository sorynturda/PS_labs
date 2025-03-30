package com.example.medcare.model.entity;

import com.example.medcare.util.AppointmentStatus;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "appointments")
@NoArgsConstructor
public class Appointment {
    public Appointment(String patientName, Doctor doctor, Date date_, MedicalService service) {
        this.patientName = patientName;
        this.doctor = doctor;
        this.date_ = date_;
        this.service = service;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="patient_name", nullable = false)
    private String patientName;
    @ManyToOne
    @JoinColumn(name = "doctors_id")
    private Doctor doctor;
    @Column(name = "date_", nullable = false)
    private Date date_;
    @ManyToOne
    @JoinColumn(name = "service_id")
    private MedicalService service;
    @Column(name = "status", nullable = false)
    private String status=String.valueOf(AppointmentStatus.NEW);

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctors) {
        this.doctor = doctors;
    }

    public Date getDate_() {
        return date_;
    }

    public void setDate_(Date date_) {
        this.date_ = date_;
    }

    public MedicalService getService() {
        return service;
    }

    public void setService(MedicalService service) {
        this.service = service;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", patientName='" + patientName + '\'' +
                ", doctors=" + doctor +
                ", date_=" + date_ +
                ", service=" + service +
                ", status='" + status + '\'' +
                '}';
    }
}
