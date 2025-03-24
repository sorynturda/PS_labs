package com.example.medcare.dao;

import com.example.medcare.entity.Doctor;
import com.example.medcare.entity.Schedule;

import java.util.List;

public interface ScheduleDAO {
    void save(Schedule schedule);
    void update(Schedule schedule);
    void delete(int id);
    List<Schedule> findByDoctor(Doctor doctor);

}
