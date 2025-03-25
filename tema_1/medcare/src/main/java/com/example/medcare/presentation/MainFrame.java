package com.example.medcare.presentation;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.awt.*;

@Component
public class MainFrame extends JFrame {


    public MainFrame() {
        if (GraphicsEnvironment.isHeadless()) {
            throw new HeadlessException("Cannot create GUI in headless mode.");
        }
        initUI();
    }

    private void initUI() {
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel panel = new JPanel();
        panel.setLayout(new FlowLayout());

        JLabel label = new JLabel("Salut din Swing + Spring Boot!");
        JButton button = new JButton("Click Me");

        button.addActionListener(e -> JOptionPane.showMessageDialog(this, "Buton Apăsat!"));

        panel.add(label);
        panel.add(button);
        add(panel);
    }
}
