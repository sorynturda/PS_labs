package com.example.medcare.model.dto;

import com.example.medcare.model.entity.Doctor;

import java.sql.Time;

public record ScheduleDTO(Doctor doctor, String dayOfTheWeek, Time startTime, Time endTime) {
}
