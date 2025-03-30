package com.example.medcare.service;

import com.example.medcare.dao.DoctorDAO;
import com.example.medcare.model.entity.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorService {
    private DoctorDAO doctorDAO;

    @Autowired
    public DoctorService(DoctorDAO doctorDAO){
        this.doctorDAO = doctorDAO;
    }

    public void addDoctor(String name, String specialization){
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctorDAO.save(doctor);
    }

    public List<Doctor> getAllDoctors(){
        return doctorDAO.findAll();
    }
}
