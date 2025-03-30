package com.example.medcare.presentation;

import com.example.medcare.model.entity.User;
import com.example.medcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;
import java.util.Vector;

public class AdminWindow extends JFrame {

    private UserService userService;

    public AdminWindow(UserService userService) {
        this.userService = userService;
        setTitle("Admin Dashboard");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        JButton accountsButton = new JButton("Manage Accounts");
        JButton clinicButton = new JButton("Manage Clinic");

        accountsButton.addActionListener(e -> new AccountsWindow(userService));
        clinicButton.addActionListener(e -> new ClinicWindow(userService));

        add(accountsButton);
        add(clinicButton);

        setVisible(true);
    }
}



