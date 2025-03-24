package com.example.medcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
public class MedicalService {
    public MedicalService(){}

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
    @OneToMany(mappedBy = "id", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
}
