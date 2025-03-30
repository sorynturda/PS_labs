package com.example.medcare.dao;

import com.example.medcare.model.entity.Doctor;

import java.util.List;

public interface DoctorDAO {
    void save(Doctor doctor);
    void delete(int id);
    void update(Doctor doctor);
    List<Doctor> findAll();
    Doctor findById(int id);
}
