package com.medcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.Duration;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medical_services")
public class MedicalService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Duration duration;

    @Column(nullable = false)
    private boolean active = true;
} 