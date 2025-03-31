package com.example.medcare.dao;

import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.Schedule;

import java.time.DayOfWeek;
import java.util.List;

public interface ScheduleDAO {
    void save(Schedule schedule);
    void update(Schedule schedule);
    void delete(int id);

    List<Schedule> findByDoctorAndDay(Doctor doctor, DayOfWeek day);

    List<Schedule> findByDoctor(Doctor doctor);
    Schedule findById(int id);

}
