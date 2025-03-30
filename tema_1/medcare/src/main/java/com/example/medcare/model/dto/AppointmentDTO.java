package com.example.medcare.model.dto;

import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.MedicalService;

import java.sql.Date;

public record AppointmentDTO(int id, String patientName, Doctor doctor, Date date_, MedicalService service, String status) {
}
