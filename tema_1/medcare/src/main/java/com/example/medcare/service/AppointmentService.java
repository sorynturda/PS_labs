package com.example.medcare.service;

import com.example.medcare.dao.AppointmentDAO;
import com.example.medcare.dao.DoctorDAO;
import com.example.medcare.dao.MedicalServiceDAO;
import com.example.medcare.model.entity.Appointment;
import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.MedicalService;
import com.example.medcare.util.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Service
@Transactional
public class AppointmentService {

    private AppointmentDAO appointmentDAO;
    private DoctorDAO doctorDAO;
    private MedicalServiceDAO medicalServiceDAO;
    @Autowired
    public AppointmentService(AppointmentDAO appointmentDAO, DoctorDAO doctorDAO, MedicalServiceDAO medicalServiceDAO) {
        this.appointmentDAO = appointmentDAO;
        this.doctorDAO = doctorDAO;
        this.medicalServiceDAO = medicalServiceDAO;
    }



    public List<Appointment> getAllAppointments() {
        return appointmentDAO.findAll();
    }

    public boolean saveAppointment(String patientName, Doctor doctor, MedicalService medicalService, Date date, Time time, String status) {
        Appointment appointment = new Appointment(patientName, doctor, date, time, medicalService);
        appointment.setStatus(status);
        appointmentDAO.save(appointment);
        return true;
    }

    public boolean isDoctorAvailable(int doctorId, Date date, Time appointmentTime) {
        Doctor doctor = doctorDAO.findById(doctorId);
        List<Appointment> appointments = appointmentDAO.findAll();
        if (appointments == null)
            return true;
        appointments = appointments.stream().filter(ap -> ap.getDate_().equals(date)).toList();
        for(Appointment ap : appointments)
            if(ap.getTime().after(appointmentTime))
                return false;
        return true;
    }
}
