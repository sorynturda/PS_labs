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
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        List<Appointment> appointments = appointmentDAO.findAll();
        System.out.println(date);
        appointments.stream().map(Appointment::getDate_).forEach(System.out::println);
        appointments = appointments.stream()
                .filter(ap -> ap.getDate_().compareTo(Date.valueOf(date.toLocalDate())) == 0)
                .toList();
        System.out.println(appointments);
        appointments.forEach(System.out::println);
        LocalTime newStart = time.toLocalTime();
        LocalTime newEnd = newStart.plusMinutes(medicalService.getDurationMinutes());
        for (Appointment ap : appointments) {
            LocalTime existingStart = ap.getTime().toLocalTime();
            LocalTime existingEnd = existingStart.plusMinutes(ap.getService().getDurationMinutes());

            if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
                return false;
            }
        }

        Appointment appointment = new Appointment(patientName, doctor, date, time, medicalService);
        appointment.setStatus(status);
        appointmentDAO.save(appointment);
        return true;
    }

    public void updateAppointment(Integer id, String status) {
        Appointment ap = appointmentDAO.findById(id);
        ap.setStatus(status);
    }

    public void removeAppointment(Integer id) {
        appointmentDAO.delete(id);
    }

    public Map<Doctor, Long> getMostRequestedDoctors(int i, java.util.Date startDate, java.util.Date endDate) {
        Date sDate = new java.sql.Date(startDate.getTime());
        Date eDate = new java.sql.Date(endDate.getTime());
        List<Appointment> appointments = appointmentDAO.findAll()
                .stream()
                .filter(ap ->
                        (ap.getDate_().after(sDate) && ap.getDate_().before(eDate)) || sDate.equals(ap.getDate_()) || eDate.equals(ap.getDate_())).toList();

        Map<Doctor, Long> all = appointments.stream().collect(Collectors.groupingBy(Appointment::getDoctor, Collectors.counting()));
        return all.entrySet().stream()
                .sorted(Map.Entry.<Doctor, Long>comparingByValue().reversed())
                .limit(i)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    public Map<MedicalService, Long> getMostRequestedServices(int i, java.util.Date startDate, java.util.Date endDate) {
        Date sDate = new java.sql.Date(startDate.getTime());
        Date eDate = new java.sql.Date(endDate.getTime());

        List<Appointment> appointments = appointmentDAO.findAll()
                .stream()
                .filter(ap ->
                        (ap.getDate_().after(sDate) && ap.getDate_().before(eDate)) || sDate.equals(ap.getDate_()) || eDate.equals(ap.getDate_())).toList();

        Map<MedicalService, Long> all = appointments.stream().collect(Collectors.groupingBy(Appointment::getService, Collectors.counting()));
        return all.entrySet().stream()
                .sorted(Map.Entry.<MedicalService, Long>comparingByValue().reversed())
                .limit(i)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    public List<Appointment> getAppointmentsBetweenDates(java.util.Date startDate, java.util.Date endDate) {
        Date sDate = new java.sql.Date(startDate.getTime());
        Date eDate = new java.sql.Date(endDate.getTime());

        return appointmentDAO.findAll().stream().
                filter(ap ->
                        (ap.getDate_().after(sDate) && ap.getDate_().before(eDate)) || sDate.equals(ap.getDate_()) || eDate.equals(ap.getDate_())).toList();
    }
}
