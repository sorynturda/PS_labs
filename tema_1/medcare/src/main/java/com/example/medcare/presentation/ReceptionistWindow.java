package com.example.medcare.presentation;

import javax.swing.*;
import java.awt.*;

public class ReceptionistWindow extends JFrame {
    public ReceptionistWindow() {
        setTitle("User Dashboard");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());
        setLocationRelativeTo(null);

        JLabel label = new JLabel("Welcome, User!");
        add(label);

        setVisible(true);
    }
}
