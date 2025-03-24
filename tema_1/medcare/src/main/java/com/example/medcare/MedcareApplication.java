package com.example.medcare;

import com.example.medcare.dao.DoctorDAO;
import com.example.medcare.dao.ScheduleDAO;
import com.example.medcare.dao.UserDAO;
import com.example.medcare.entity.Doctor;
import com.example.medcare.entity.Schedule;
import com.example.medcare.entity.User;
import com.example.medcare.util.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.print.Doc;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalTime;

@SpringBootApplication
public class MedcareApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedcareApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(UserDAO userDAO, ScheduleDAO scheduleDAO, DoctorDAO doctorDAO) {
        return runner -> {
//			createUser(userDAO);
//			createDoctor(doctorDAO);
//            createSchedule(scheduleDAO, doctorDAO);
			findDoctor(doctorDAO);
//			findUser(userDAO);
        };

    }

	private void findUser(UserDAO userDAO) {
		User user = userDAO.findById(1);
		System.out.println(user.toString());
	}

	private void findDoctor(DoctorDAO doctorDAO) {
		Doctor doctor = doctorDAO.findById(1);
		System.out.println(doctor);
	}

	private void createSchedule(ScheduleDAO scheduleDAO, DoctorDAO doctorDAO) {
        Doctor d = doctorDAO.findById(1);
        Schedule s = new Schedule(d, String.valueOf(DayOfWeek.MONDAY), Time.valueOf(LocalTime.now()), Time.valueOf(LocalTime.now()));
		scheduleDAO.save(s);
    }

    private void createDoctor(DoctorDAO doctorDAO) {
        Doctor d = new Doctor("sorin", "ginecolog");
        doctorDAO.save(d);
    }

    private void createUser(UserDAO userDAO) {
        User user = new User("sirin", "sorins", "@.asd", String.valueOf(UserRole.USER));
        userDAO.save(user);
    }
}
