package com.medcare.repository;

import com.medcare.model.MedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    List<MedicalService> findByActiveTrue();
} 