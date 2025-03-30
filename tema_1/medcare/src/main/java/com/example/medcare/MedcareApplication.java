package com.example.medcare;

import com.example.medcare.dao.DoctorDAO;
import com.example.medcare.dao.ScheduleDAO;
import com.example.medcare.dao.UserDAO;
import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.Schedule;
import com.example.medcare.model.entity.User;
import com.example.medcare.presentation.LoginForm;
import com.example.medcare.service.UserService;
import com.example.medcare.util.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;

import javax.swing.*;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalTime;

@SpringBootApplication
public class MedcareApplication {
    private static ConfigurableApplicationContext context;

    public static void main(String[] args) {
//        SpringApplication.run(MedcareApplication.class, args);
        context = new SpringApplicationBuilder(MedcareApplication.class)
                .headless(false)
                .run(args);
        SwingUtilities.invokeLater(() -> {
            // Get MainFrame from Spring context
            LoginForm loginForm = context.getBean(LoginForm.class);
            loginForm.setVisible(true);
        });
    }


//    @Bean
    public CommandLineRunner commandLineRunner(UserDAO userDAO, ScheduleDAO scheduleDAO, DoctorDAO doctorDAO, UserService userService) {
        return runner -> {
			userService.createUser("sorin", "sss", "sss");
//			createDoctor(doctorDAO);
//            createSchedule(scheduleDAO, doctorDAO);
//			findDoctor(doctorDAO);
//			findUser(userDAO);
//            findSchedule(scheduleDAO, doctorDAO);
        };

    }

}
