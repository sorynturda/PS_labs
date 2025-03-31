package com.example.medcare.model.entity;

import com.example.medcare.util.AppointmentStatus;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "appointments")
public class Appointment {
    public Appointment(){}
    public Appointment(String patientName, Doctor doctor, Date date_, Time time, MedicalService service) {
        this.patientName = patientName;
        this.doctor = doctor;
        this.date_ = date_;
        this.service = service;
        this.time = time;
    }

    public Appointment(String patientName, Doctor doctor, Date date_, Time time, MedicalService service, String status) {
        this.patientName = patientName;
        this.doctor = doctor;
        this.date_ = date_;
        this.time = time;
        this.service = service;
        this.status = status;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    @ManyToOne
    @JoinColumn(name = "doctors_id")
    private Doctor doctor;
    @Column(name = "date_", nullable = false)
    private Date date_;
    @Column(name = "time", nullable = false)
    private Time time;
    @ManyToOne
    @JoinColumn(name = "service_id")
    private MedicalService service;
    @Column(name = "status",  nullable = false)
    private String status;

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

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
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
