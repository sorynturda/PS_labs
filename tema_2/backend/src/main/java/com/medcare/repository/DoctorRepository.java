package com.medcare.repository;

import com.medcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByActiveTrue();
    List<Doctor> findBySpecialization(String specialization);
} 