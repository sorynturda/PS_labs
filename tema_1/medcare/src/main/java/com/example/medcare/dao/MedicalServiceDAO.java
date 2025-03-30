package com.example.medcare.dao;

import com.example.medcare.model.entity.MedicalService;

import java.util.List;

public interface MedicalServiceDAO {
    void save(MedicalService medicalService);
    void delete(int id);
    void update(MedicalService medicalService);
    List<MedicalService> findAll();

}
