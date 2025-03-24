package com.example.medcare;

import com.example.medcare.dao.UserDAO;
import com.example.medcare.entity.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedcareApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedcareApplication.class, args);
	}

	public CommandLineRunner commandLineRunner(UserDAO userDAO){
		createUser(userDAO);
	}

	private void createUser(UserDAO userDAO) {
		User user = new User("sirin", "sorins", "@.asd", String.valueOf())
	}
}
