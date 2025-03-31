package com.example.medcare.service;


import com.example.medcare.dao.DoctorDAO;
import com.example.medcare.dao.ScheduleDAO;
import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.Schedule;
import com.example.medcare.presentation.ScheduleWindow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ScheduleService {
    private ScheduleDAO scheduleDAO;
    private DoctorDAO doctorDAO;

    @Autowired
    public ScheduleService(ScheduleDAO scheduleDAO, DoctorDAO doctorDAO) {
        this.scheduleDAO = scheduleDAO;
        this.doctorDAO = doctorDAO;
    }

    public void addSchedule(int doctor_id, String dayOfTheWeek, Time startTime, Time endTime) throws Exception {
        List<String> days = Collections.singletonList(Arrays.toString(DayOfWeek.values()).toLowerCase());
        if (days.contains(dayOfTheWeek)) {
            throw new Exception("Enter a valid day of the week!");
        }
        List<Schedule> schedules = scheduleDAO.findByDoctor(doctorDAO.findById(doctor_id));
        for (Schedule schedule : schedules)
            if (schedule.getDayOfTheWeek().equalsIgnoreCase(dayOfTheWeek))
                throw new Exception("SChedule for this day already exists!");
        if (startTime.after(endTime))
            throw new Exception("Choose the correct start and end time!");
        Schedule schedule = new Schedule();
        schedule.setDoctor(doctorDAO.findById(doctor_id));
        schedule.setDayOfTheWeek(dayOfTheWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        scheduleDAO.save(schedule);
    }

    public List<Schedule> getSchedulesByDoctorId(int doctorId) {
        Doctor doctor = doctorDAO.findById(doctorId);
        return scheduleDAO.findByDoctor(doctor);
    }

    public void updateSchedule(int scheduleId, int doctorId, String dayOfTheWeek, Time startTime, Time endTime) throws Exception {
        Schedule schedule = scheduleDAO.findById(scheduleId);
        List<String> days = Collections.singletonList(Arrays.toString(DayOfWeek.values()).toLowerCase());
        if (days.contains(dayOfTheWeek)) {
            throw new Exception("Enter a valid day of the week!");
        }
        if (startTime.after(endTime))
            throw new Exception("Choose the correct start and end time!");
        schedule.setDayOfTheWeek(dayOfTheWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        scheduleDAO.update(schedule);
    }

    public List<Schedule> getScheduleByDoctorAndDay(int id, int dayOfWeek) {
        DayOfWeek day = DayOfWeek.of(dayOfWeek);
        Doctor doctor = doctorDAO.findById(id);
        return scheduleDAO.findByDoctorAndDay(doctor, day);
    }
}
