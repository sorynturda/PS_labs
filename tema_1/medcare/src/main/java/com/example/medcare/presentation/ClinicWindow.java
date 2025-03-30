package com.example.medcare.presentation;

import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.MedicalService;
import com.example.medcare.service.DoctorService;
import com.example.medcare.service.MedicalServiceService;
import com.example.medcare.service.UserService;
import java.util.List;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

public class ClinicWindow extends JFrame {

    private DoctorService doctorService;
    private MedicalServiceService medicalServiceService;

    private JTable doctorsTable;
    private JTable servicesTable;
    private DefaultTableModel doctorsTableModel;
    private DefaultTableModel servicesTableModel;

    public ClinicWindow(DoctorService doctorService, MedicalServiceService medicalServiceService) {
        this.doctorService = doctorService;
        this.medicalServiceService = medicalServiceService;

        setTitle("Manage Clinic");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());


        String[] doctorsColumnNames = {"ID", "Name", "Specialization"};
        doctorsTableModel = new DefaultTableModel(doctorsColumnNames, 0);
        doctorsTable = new JTable(doctorsTableModel);
        add(new JScrollPane(doctorsTable), BorderLayout.NORTH);


        String[] servicesColumnNames = {"ID", "Name", "Price", "Duration (Minutes)"};
        servicesTableModel = new DefaultTableModel(servicesColumnNames, 0);
        servicesTable = new JTable(servicesTableModel);
        add(new JScrollPane(servicesTable), BorderLayout.CENTER);


        JPanel doctorFormPanel = new JPanel(new GridLayout(3, 2));
        JTextField doctorNameField = new JTextField();
        JTextField doctorSpecializationField = new JTextField();
        JButton createDoctorButton = new JButton("Create Doctor");

        doctorFormPanel.add(new JLabel("Doctor Name:"));
        doctorFormPanel.add(doctorNameField);
        doctorFormPanel.add(new JLabel("Specialization:"));
        doctorFormPanel.add(doctorSpecializationField);
        doctorFormPanel.add(new JLabel(""));

        add(doctorFormPanel, BorderLayout.SOUTH);


        JPanel serviceFormPanel = new JPanel(new GridLayout(4, 1));
        JTextField serviceNameField = new JTextField();
        JTextField servicePriceField = new JTextField();
        JTextField serviceDurationField = new JTextField();
        JButton createServiceButton = new JButton("Create Service");

        serviceFormPanel.add(new JLabel("Service Name:"));
        serviceFormPanel.add(serviceNameField);
        serviceFormPanel.add(new JLabel("Price:"));
        serviceFormPanel.add(servicePriceField);
        serviceFormPanel.add(new JLabel("Duration (Minutes):"));
        serviceFormPanel.add(serviceDurationField);
        serviceFormPanel.add(new JLabel(""));
        serviceFormPanel.add(createServiceButton);
        doctorFormPanel.add(createDoctorButton);

        add(serviceFormPanel, BorderLayout.EAST);


        createDoctorButton.addActionListener(e -> {
            String name = doctorNameField.getText();
            String specialization = doctorSpecializationField.getText();

            if (!name.isEmpty() && !specialization.isEmpty()) {
                doctorService.addDoctor(name, specialization);
                populateDoctorsTable();
                doctorNameField.setText("");
                doctorSpecializationField.setText("");
            } else {
                JOptionPane.showMessageDialog(this, "All fields must be filled!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        // Action listener pentru crearea unui serviciu medical
        createServiceButton.addActionListener(e -> {
            String name = serviceNameField.getText();
            String priceStr = servicePriceField.getText();
            String durationStr = serviceDurationField.getText();

            if (!name.isEmpty() && !priceStr.isEmpty() && !durationStr.isEmpty()) {
                try {
                    double price = Double.parseDouble(priceStr);
                    int duration = Integer.parseInt(durationStr);
                    medicalServiceService.createService(name, price, duration);
                    populateServicesTable(); // Actualizează tabelul serviciilor medicale
                    serviceNameField.setText("");
                    servicePriceField.setText("");
                    serviceDurationField.setText("");
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(this, "Invalid input for price or duration!", "Error", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "All fields must be filled!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        populateDoctorsTable();
        populateServicesTable();

        setVisible(true);
    }

    private void populateDoctorsTable() {
        doctorsTableModel.setRowCount(0);
        List<Doctor> doctors = doctorService.getAllDoctors();
        for (Doctor doctor : doctors) {
            Object[] rowData = {doctor.getId(), doctor.getName(), doctor.getSpecialization()};
            doctorsTableModel.addRow(rowData);
        }
    }

    private void populateServicesTable() {
        servicesTableModel.setRowCount(0);
        List<MedicalService> services = medicalServiceService.getAllServices();
        for (MedicalService service : services) {
            Object[] rowData = {service.getId(), service.getName(), service.getPrice(), service.getDurationMinutes()};
            servicesTableModel.addRow(rowData);
        }
    }
}