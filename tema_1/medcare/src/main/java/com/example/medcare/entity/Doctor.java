package com.example.medcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "doctors")
public class Doctor {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToMany(mappedBy = "id", cascade = CascadeType.ALL)
    private List<Schedule> schedules = new ArrayList<>();
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "specialization", nullable = false)
    private String specialization;
}
