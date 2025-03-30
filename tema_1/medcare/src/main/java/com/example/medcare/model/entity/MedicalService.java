package com.example.medcare.model.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "medical_services")
public class MedicalService {
    public MedicalService() {
    }

    public MedicalService(String name, Double price, int durationMinutes) {
        this.name = name;
        this.price = price;
        this.durationMinutes = durationMinutes;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "price", nullable = false)
    private Double price;
    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<Appointment> appointments;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }
}
