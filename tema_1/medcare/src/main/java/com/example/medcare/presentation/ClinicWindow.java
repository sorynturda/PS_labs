package com.example.medcare.presentation;

import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.MedicalService;
import com.example.medcare.service.DoctorService;
import com.example.medcare.service.MedicalServiceService;
import com.example.medcare.service.ScheduleService;
import com.example.medcare.service.UserService;
import java.util.List;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

public class ClinicWindow extends JFrame {

    private DoctorService doctorService;
    private MedicalServiceService medicalServiceService;
    private ScheduleService scheduleService;

    private JTable doctorsTable;
    private JTable servicesTable;
    private DefaultTableModel doctorsTableModel;
    private DefaultTableModel servicesTableModel;
    public ClinicWindow(DoctorService doctorService, MedicalServiceService medicalServiceService, ScheduleService scheduleService) {
        this.doctorService = doctorService;
        this.medicalServiceService = medicalServiceService;
        this.scheduleService=scheduleService;
        setTitle("Manage Clinic");
        setSize(1200, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setResizable(true);
        setLocationRelativeTo(null);

        // Main panel with BorderLayout
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Panel for tables - split into left and right
        JPanel tablesPanel = new JPanel(new GridLayout(1, 2, 10, 0));

        // Doctors section (left side)
        JPanel doctorsPanel = new JPanel(new BorderLayout(0, 10));
        doctorsPanel.setBorder(BorderFactory.createTitledBorder("Doctors"));

        // Doctors table
        String[] doctorsColumnNames = {"ID", "Name", "Specialization"};
        doctorsTableModel = new DefaultTableModel(doctorsColumnNames, 0);
        doctorsTable = new JTable(doctorsTableModel);
        doctorsPanel.add(new JScrollPane(doctorsTable), BorderLayout.CENTER);

        // Doctors form
        JPanel doctorFormPanel = new JPanel(new GridLayout(4, 2, 5, 5));
        doctorFormPanel.setBorder(BorderFactory.createEmptyBorder(5, 0, 5, 0));

        JTextField doctorNameField = new JTextField();
        JTextField doctorSpecializationField = new JTextField();
        JButton createDoctorButton = new JButton("Create Doctor");
        JButton selectDoctorButton = new JButton("Select Doctor");

        doctorFormPanel.add(new JLabel("Doctor Name:"));
        doctorFormPanel.add(doctorNameField);
        doctorFormPanel.add(new JLabel("Specialization:"));
        doctorFormPanel.add(doctorSpecializationField);
        doctorFormPanel.add(new JLabel(""));
        doctorFormPanel.add(createDoctorButton);
        doctorFormPanel.add(new JLabel(""));
        doctorFormPanel.add(selectDoctorButton);

        doctorsPanel.add(doctorFormPanel, BorderLayout.SOUTH);

        // Services section (right side)
        JPanel servicesPanel = new JPanel(new BorderLayout(0, 10));
        servicesPanel.setBorder(BorderFactory.createTitledBorder("Medical Services"));

        // Services table
        String[] servicesColumnNames = {"ID", "Name", "Price", "Duration (Minutes)"};
        servicesTableModel = new DefaultTableModel(servicesColumnNames, 0);
        servicesTable = new JTable(servicesTableModel);
        servicesPanel.add(new JScrollPane(servicesTable), BorderLayout.CENTER);

        // Services form
        JPanel serviceFormPanel = new JPanel(new GridLayout(5, 2, 5, 5));
        serviceFormPanel.setBorder(BorderFactory.createEmptyBorder(5, 0, 5, 0));

        JTextField serviceNameField = new JTextField();
        JTextField servicePriceField = new JTextField();
        JTextField serviceDurationField = new JTextField();
        JButton createServiceButton = new JButton("Create Service");
        JButton selectServiceButton = new JButton("Select Service");

        serviceFormPanel.add(new JLabel("Service Name:"));
        serviceFormPanel.add(serviceNameField);
        serviceFormPanel.add(new JLabel("Price:"));
        serviceFormPanel.add(servicePriceField);
        serviceFormPanel.add(new JLabel("Duration (Minutes):"));
        serviceFormPanel.add(serviceDurationField);
        serviceFormPanel.add(new JLabel(""));
        serviceFormPanel.add(createServiceButton);
        serviceFormPanel.add(new JLabel(""));
        serviceFormPanel.add(selectServiceButton);
        servicesPanel.add(serviceFormPanel, BorderLayout.SOUTH);

        // Add both sections to tables panel
        tablesPanel.add(doctorsPanel);
        tablesPanel.add(servicesPanel);

        // Add tables panel to main panel
        mainPanel.add(tablesPanel, BorderLayout.CENTER);

        // Add main panel to frame
        add(mainPanel);

        // Action listener for creating a doctor
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

        // Action listener for selecting a doctor
        selectDoctorButton.addActionListener(e -> {
            int selectedRow = doctorsTable.getSelectedRow();
            if (selectedRow >= 0) {
                int doctorId = (int) doctorsTableModel.getValueAt(selectedRow, 0);
                String doctorName = (String) doctorsTableModel.getValueAt(selectedRow, 1);
                JOptionPane.showMessageDialog(this, "Selected doctor: " + doctorName + " (ID: " + doctorId + ")",
                                             "Doctor Selected", JOptionPane.INFORMATION_MESSAGE);
                new ScheduleWindow(scheduleService, doctorId);
            } else {
                JOptionPane.showMessageDialog(this, "Please select a doctor from the table!",
                                             "No Selection", JOptionPane.WARNING_MESSAGE);
            }
        });
        // Action listener for creating a medical service
        createServiceButton.addActionListener(e -> {
            String name = serviceNameField.getText();
            String priceStr = servicePriceField.getText();
            String durationStr = serviceDurationField.getText();

            if (!name.isEmpty() && !priceStr.isEmpty() && !durationStr.isEmpty()) {
                try {
                    double price = Double.parseDouble(priceStr);
                    int duration = Integer.parseInt(durationStr);
                    medicalServiceService.createService(name, price, duration);
                    populateServicesTable();
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


        selectServiceButton.addActionListener(e -> {
            int selectedRow = servicesTable.getSelectedRow();
            if (selectedRow >= 0) {
                Integer serviceId = (Integer) servicesTableModel.getValueAt(selectedRow, 0);
                String serviceName = (String) servicesTableModel.getValueAt(selectedRow, 1);
                Double servicePrice = Double.valueOf(servicesTableModel.getValueAt(selectedRow, 2).toString());
                System.out.println(servicePrice);
                Integer serviceDuration = Integer.valueOf(servicesTableModel.getValueAt(selectedRow, 3).toString());
                System.out.println(serviceDuration);
                JOptionPane.showMessageDialog(this, "Selected service: " + serviceName + " (ID: " + serviceId + ")",
                                             "Service Selected", JOptionPane.INFORMATION_MESSAGE);
                medicalServiceService.updateService(serviceId, serviceName, servicePrice, serviceDuration);
            } else {
                JOptionPane.showMessageDialog(this, "Please select a service from the table!",
                                             "No Selection", JOptionPane.WARNING_MESSAGE);
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