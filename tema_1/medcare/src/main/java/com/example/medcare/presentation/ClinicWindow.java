package com.example.medcare.presentation;

import com.example.medcare.service.UserService;

import javax.swing.*;
import java.awt.*;

public class ClinicWindow extends JFrame {
    private UserService userService
    public ClinicWindow(UserService userService) {
        this.userService = userService;
        setTitle("Manage Clinic");
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new FlowLayout());

        add(new JLabel("Clinic Management"));

        setVisible(true);
    }
}
