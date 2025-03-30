package com.example.medcare.presentation;

import javax.swing.*;
import java.awt.*;

import com.example.medcare.model.entity.User;
import com.example.medcare.service.UserService;
import com.example.medcare.util.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class LoginForm extends JFrame {
    private JTextField usernameField;
    private JPasswordField passwordField;
    private UserService userService;

    @Autowired
    public LoginForm(UserService userService) {
        this.userService = userService;

        setTitle("Login");
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new GridLayout(3, 2));

        add(new JLabel("username:"));
        usernameField = new JTextField();
        add(usernameField);

        add(new JLabel("Password:"));
        passwordField = new JPasswordField();
        add(passwordField);

        JButton loginButton = new JButton("Login");
        loginButton.addActionListener(e -> loginUser());
        add(loginButton);

        setVisible(true);
    }

    private void loginUser() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        Optional<User> userOpt = userService.authenticate(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            JOptionPane.showMessageDialog(this, "Login successful!");
            this.dispose();
            if (user.getRole_().equals(UserRole.ADMIN.toString())) {
                new AdminWindow(userService);
            } else {
                new ReceptionistWindow();
            }
        } else {

            JOptionPane.showMessageDialog(this, "Invalid username or password!", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}