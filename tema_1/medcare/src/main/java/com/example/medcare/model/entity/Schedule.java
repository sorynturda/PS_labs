package com.example.medcare.model.entity;

import jakarta.persistence.*;

import java.sql.Time;

@Entity
@Table(name = "schedules")
public class Schedule {
    public Schedule(){}
    public Schedule(Doctor doctor, String dayOfTheWeek, Time startTime, Time endTime) {
        this.doctor = doctor;
        this.dayOfTheWeek = dayOfTheWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    @Column(name = "day_of_the_week", nullable = false)
    private String dayOfTheWeek;
    @Column(name = "start_time", nullable = false)
    private Time startTime;
    @Column(name = "end_time", nullable = false)
    private Time endTime;

    public int getId() {
        return id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public String getDayOfTheWeek() {
        return dayOfTheWeek;
    }

    public Time getStartTime() {
        return startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public void setDayOfTheWeek(String dayOfTheWeek) {
        this.dayOfTheWeek = dayOfTheWeek;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "id=" + id +
                ", doctor=" + doctor.getId() +
                ", dayOfTheWeek='" + dayOfTheWeek + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
