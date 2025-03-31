package com.example.medcare.presentation;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;

import com.example.medcare.model.entity.User;
import com.example.medcare.service.*;
import com.example.medcare.util.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LoginForm extends JFrame {
    private final UserService userService;
    private final DoctorService doctorService;
    private final MedicalServiceService medicalServiceService;
    private final ScheduleService scheduleService;
    private final AppointmentService appointmentService;

    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginButton;
    private JButton cancelButton;

    @Autowired
    public LoginForm(UserService userService, DoctorService doctorService, MedicalServiceService medicalServiceService, ScheduleService scheduleService, AppointmentService appointmentService) {
        this.userService = userService;
        this.doctorService = doctorService;
        this.medicalServiceService = medicalServiceService;
        this.scheduleService = scheduleService;
        this.appointmentService = appointmentService;
        initializeUI();
        setupActionListeners();
    }

    private void initializeUI() {
        // Basic window setup
        setTitle("MedCare Login");
        setSize(400, 250);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // Main panel with BorderLayout
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Title label at the top
        JLabel titleLabel = new JLabel("MedCare System Login", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 18));
        mainPanel.add(titleLabel, BorderLayout.NORTH);

        // Form panel in the center
        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);

        // Username row
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 1;
        JLabel usernameLabel = new JLabel("Username:");
        formPanel.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        usernameField = new JTextField(15);
        formPanel.add(usernameField, gbc);

        // Password row
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.gridwidth = 1;
        JLabel passwordLabel = new JLabel("Password:");
        formPanel.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.gridwidth = 2;
        passwordField = new JPasswordField(15);
        formPanel.add(passwordField, gbc);

        mainPanel.add(formPanel, BorderLayout.CENTER);

        // Buttons panel at the bottom
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 0));

        loginButton = new JButton("Login");
        loginButton.setPreferredSize(new Dimension(100, 30));
        buttonPanel.add(loginButton);

        cancelButton = new JButton("Cancel");
        cancelButton.setPreferredSize(new Dimension(100, 30));
        buttonPanel.add(cancelButton);

        mainPanel.add(buttonPanel, BorderLayout.SOUTH);

        // Add main panel to frame
        add(mainPanel);
    }

    private void setupActionListeners() {
        // Login button action
        loginButton.addActionListener(this::loginUser);

        // Cancel button action
        cancelButton.addActionListener(e -> {
            int result = JOptionPane.showConfirmDialog(
                    this,
                    "Are you sure you want to exit?",
                    "Confirm Exit",
                    JOptionPane.YES_NO_OPTION
            );

            if (result == JOptionPane.YES_OPTION) {
                dispose();
                System.exit(0);
            }
        });

        // Enable login on Enter key from password field
        passwordField.addActionListener(this::loginUser);
    }

    private void loginUser(ActionEvent e) {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(
                    this,
                    "Please enter both username and password",
                    "Input Error",
                    JOptionPane.WARNING_MESSAGE
            );
            return;
        }

        Optional<User> userOpt = userService.authenticate(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            JOptionPane.showMessageDialog(
                    this,
                    "Login successful!",
                    "Success",
                    JOptionPane.INFORMATION_MESSAGE
            );

            this.dispose();

            if (user.getRole_().equals(UserRole.ADMIN.toString())) {
                new AdminWindow(userService, doctorService, medicalServiceService, scheduleService, appointmentService);
            } else {
                new ReceptionistWindow(appointmentService, doctorService, medicalServiceService, scheduleService);
            }
        } else {
            JOptionPane.showMessageDialog(
                    this,
                    "Invalid username or password!",
                    "Authentication Error",
                    JOptionPane.ERROR_MESSAGE
            );

            // Clear password field but keep username
            passwordField.setText("");
            passwordField.requestFocus();
        }
    }
}