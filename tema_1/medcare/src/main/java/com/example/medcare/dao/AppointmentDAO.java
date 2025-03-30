package com.example.medcare.dao;

import com.example.medcare.model.entity.Appointment;

import java.util.List;

public interface AppointmentDAO {
    void save(Appointment appointment);
    void delete(int id);
    void update(Appointment appointment);
    List<Appointment> findAll();
}
