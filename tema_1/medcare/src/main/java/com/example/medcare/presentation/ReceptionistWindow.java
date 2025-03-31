package com.example.medcare.presentation;

import com.example.medcare.model.entity.*;
import com.example.medcare.service.*;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.Date;
import java.sql.Time;
import java.util.Calendar;
import java.util.List;

public class ReceptionistWindow extends JFrame {
    private JPanel mainPanel;
    private JTable appointmentsTable;
    private DefaultTableModel tableModel;
    private JComboBox<Doctor> doctorComboBox;
    private JComboBox<MedicalService> serviceComboBox;
    private JComboBox<String> statusComboBox;
    private JTextField patientNameField;
    private JSpinner dateSpinner;
    private JSpinner timeSpinner;
    private JButton saveButton, clearButton, refreshButton;
    private JLabel availabilityLabel; // Added for direct reference
    private final AppointmentService appointmentService;
    private final DoctorService doctorService;
    private final MedicalServiceService medicalServiceService;
    private final ScheduleService scheduleService;

    public ReceptionistWindow(AppointmentService appointmentService, DoctorService doctorService,
                              MedicalServiceService medicalServiceService, ScheduleService scheduleService) {
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
        this.medicalServiceService = medicalServiceService;
        this.scheduleService = scheduleService;
        initializeUI();
        loadData();
        addListeners();
        this.setVisible(true);
    }

    private void initializeUI() {
        setTitle("MedCare - Receptionist Dashboard");
        setSize(1000, 700);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);

        // Main panel with border layout
        mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Create appointment form panel
        JPanel formPanel = createAppointmentFormPanel();

        // Create appointments table panel
        JPanel tablePanel = createAppointmentsTablePanel();

        // Create a split pane to allow resizing between form and table
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, formPanel, tablePanel);
        splitPane.setDividerLocation(350);
        splitPane.setOneTouchExpandable(true);

        mainPanel.add(splitPane, BorderLayout.CENTER);

        // Add a status bar at the bottom
        JPanel statusBar = new JPanel(new BorderLayout());
        statusBar.setBorder(BorderFactory.createEtchedBorder());
        JLabel statusLabel = new JLabel("Ready");
        statusBar.add(statusLabel, BorderLayout.WEST);
        mainPanel.add(statusBar, BorderLayout.SOUTH);

        setContentPane(mainPanel);
    }

    private JPanel createAppointmentFormPanel() {
        JPanel formPanel = new JPanel();
        formPanel.setLayout(new BoxLayout(formPanel, BoxLayout.Y_AXIS));
        formPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createTitledBorder("New Appointment"),
                BorderFactory.createEmptyBorder(5, 5, 5, 5)));

        // Patient information section
        JPanel patientPanel = new JPanel(new GridBagLayout());
        patientPanel.setBorder(BorderFactory.createTitledBorder("Patient Information"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(5, 5, 5, 5);

        patientPanel.add(new JLabel("Patient Name:"), gbc);
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        patientNameField = new JTextField(20);
        patientPanel.add(patientNameField, gbc);

        formPanel.add(patientPanel);
        formPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Appointment details section
        JPanel detailsPanel = new JPanel(new GridBagLayout());
        detailsPanel.setBorder(BorderFactory.createTitledBorder("Appointment Details"));

        gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(5, 5, 5, 5);

        detailsPanel.add(new JLabel("Doctor:"), gbc);
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        doctorComboBox = new JComboBox<>();
        // Set custom renderer for doctor combo box to only display doctor name
        doctorComboBox.setRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(JList<?> list, Object value, int index,
                                                          boolean isSelected, boolean cellHasFocus) {
                super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
                if (value instanceof Doctor) {
                    setText(((Doctor) value).getName());
                }
                return this;
            }
        });
        detailsPanel.add(doctorComboBox, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.weightx = 0.0;
        detailsPanel.add(new JLabel("Medical Service:"), gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        serviceComboBox = new JComboBox<>();
        // Set custom renderer for service combo box to only display service name
        serviceComboBox.setRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(JList<?> list, Object value, int index,
                                                          boolean isSelected, boolean cellHasFocus) {
                super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
                if (value instanceof MedicalService) {
                    setText(((MedicalService) value).getName());
                }
                return this;
            }
        });
        detailsPanel.add(serviceComboBox, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.weightx = 0.0;
        detailsPanel.add(new JLabel("Date:"), gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        JPanel datePanel = new JPanel(new BorderLayout());
        dateSpinner = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(dateSpinner, "yyyy-MM-dd");
        dateSpinner.setEditor(dateEditor);
        datePanel.add(dateSpinner, BorderLayout.CENTER);
        detailsPanel.add(datePanel, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.weightx = 0.0;
        detailsPanel.add(new JLabel("Time:"), gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        JPanel timePanel = new JPanel(new BorderLayout());
        timeSpinner = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor timeEditor = new JSpinner.DateEditor(timeSpinner, "HH:mm");
        timeSpinner.setEditor(timeEditor);
        timePanel.add(timeSpinner, BorderLayout.CENTER);
        detailsPanel.add(timePanel, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.weightx = 0.0;
        detailsPanel.add(new JLabel("Status:"), gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        statusComboBox = new JComboBox<>(new String[]{"New", "In Progress", "Completed"});
        detailsPanel.add(statusComboBox, gbc);

        formPanel.add(detailsPanel);
        formPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Availability indicator
        JPanel availabilityPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        availabilityPanel.add(new JLabel("Doctor Availability:"));
        availabilityLabel = new JLabel("Unknown"); // Store reference in class field
        availabilityLabel.setForeground(Color.GRAY);
        availabilityPanel.add(availabilityLabel);
        formPanel.add(availabilityPanel);
        formPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Button panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        clearButton = new JButton("Clear Form");
        saveButton = new JButton("Save Appointment");
        buttonPanel.add(clearButton);
        buttonPanel.add(saveButton);
        formPanel.add(buttonPanel);

        formPanel.add(Box.createVerticalGlue());

        return formPanel;
    }

    private JPanel createAppointmentsTablePanel() {
        JPanel tablePanel = new JPanel(new BorderLayout(5, 5));
        tablePanel.setBorder(BorderFactory.createTitledBorder("Appointments"));

        // Create table model and table
        String[] columnNames = {"ID", "Patient", "Doctor", "Service", "Date", "Time", "Status"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        appointmentsTable = new JTable(tableModel);
        appointmentsTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        appointmentsTable.setAutoResizeMode(JTable.AUTO_RESIZE_ALL_COLUMNS);

        // Add table to scroll pane
        JScrollPane scrollPane = new JScrollPane(appointmentsTable);
        tablePanel.add(scrollPane, BorderLayout.CENTER);

        // Add table control buttons
        JPanel tableButtonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        refreshButton = new JButton("Refresh");
        JButton editButton = new JButton("Edit");
        JButton deleteButton = new JButton("Delete");

        tableButtonPanel.add(refreshButton);
        tableButtonPanel.add(editButton);
        tableButtonPanel.add(deleteButton);
        tablePanel.add(tableButtonPanel, BorderLayout.NORTH);

        // Add search panel
        JPanel searchPanel = new JPanel(new BorderLayout());
        searchPanel.setBorder(BorderFactory.createEmptyBorder(5, 0, 0, 0));
        JTextField searchField = new JTextField();
        searchField.setToolTipText("Search appointments");
        JButton searchButton = new JButton("Search");
        searchPanel.add(new JLabel("Search: "), BorderLayout.WEST);
        searchPanel.add(searchField, BorderLayout.CENTER);
        searchPanel.add(searchButton, BorderLayout.EAST);
        tablePanel.add(searchPanel, BorderLayout.SOUTH);

        return tablePanel;
    }

    private void loadData() {
        doctorService.getAllDoctors().forEach(doctorComboBox::addItem);
        medicalServiceService.getAllServices().forEach(serviceComboBox::addItem);
        refreshAppointmentsTable();
    }

    private void refreshAppointmentsTable() {
        tableModel.setRowCount(0);
        appointmentService.getAllAppointments().forEach(appointment -> tableModel.addRow(new Object[]{
                appointment.getId(),
                appointment.getPatientName(),
                appointment.getDoctor().getName(),
                appointment.getService().getName(),
                appointment.getDate_(),
                appointment.getTime(),
                appointment.getStatus()
        }));
    }

    private void addListeners() {
        saveButton.addActionListener(e -> saveAppointment());
        clearButton.addActionListener(e -> clearForm());
        refreshButton.addActionListener(e -> refreshAppointmentsTable());
        doctorComboBox.addActionListener(e -> checkDoctorAvailability());
        dateSpinner.addChangeListener(e -> checkDoctorAvailability());
        timeSpinner.addChangeListener(e -> checkDoctorAvailability());

        // Add listener for table selection
        appointmentsTable.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting() && appointmentsTable.getSelectedRow() != -1) {
                Object id = tableModel.getValueAt(appointmentsTable.getSelectedRow(), 0);
                appointmentService.removeAppointment((Integer) id);
                refreshAppointmentsTable();
            }
        });
    }

    private void saveAppointment() {
        String patientName = patientNameField.getText().trim();
        Doctor selectedDoctor = (Doctor) doctorComboBox.getSelectedItem();
        MedicalService selectedService = (MedicalService) serviceComboBox.getSelectedItem();
        String status = (String) statusComboBox.getSelectedItem();
        java.util.Date utilDate = (java.util.Date) dateSpinner.getValue();
        java.util.Date utilTime = (java.util.Date) timeSpinner.getValue();

        if (patientName.isEmpty() || selectedDoctor == null || selectedService == null) {
            JOptionPane.showMessageDialog(this, "All fields must be filled!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!isDoctorAvailable(selectedDoctor, utilDate, utilTime)) {
            JOptionPane.showMessageDialog(this, "Doctor is not available at selected time", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        Date date = new Date(utilDate.getTime());
        Time time = new Time(utilTime.getTime());

        boolean success = appointmentService.saveAppointment(patientName, selectedDoctor, selectedService, date, time, status);
        if (success) {
            JOptionPane.showMessageDialog(this, "Appointment saved successfully", "Success", JOptionPane.INFORMATION_MESSAGE);
            clearForm();
            refreshAppointmentsTable();
        } else {
            JOptionPane.showMessageDialog(this, "Failed to save appointment", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private boolean isDoctorAvailable(Doctor doctor, java.util.Date date, java.util.Date time) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        List<Schedule> schedules = scheduleService.getScheduleByDoctorAndDay(doctor.getId(), dayOfWeek);

        if (schedules.isEmpty()) return false;

        Time appointmentTime = new Time(time.getTime());
        return schedules.stream().anyMatch(schedule ->
                appointmentTime.after(schedule.getStartTime()) &&
                        appointmentTime.before(schedule.getEndTime()));
    }

    private void checkDoctorAvailability() {
        Doctor selectedDoctor = (Doctor) doctorComboBox.getSelectedItem();
        java.util.Date utilDate = (java.util.Date) dateSpinner.getValue();
        java.util.Date utilTime = (java.util.Date) timeSpinner.getValue();

        if (selectedDoctor != null) {
            boolean available = isDoctorAvailable(selectedDoctor, utilDate, utilTime);
            saveButton.setEnabled(available);
            saveButton.setToolTipText(available ? "Save appointment" : "Doctor is not available at selected time");

            // Update availability label using the direct reference
            if (availabilityLabel != null) {
                if (available) {
                    availabilityLabel.setText("Available");
                    availabilityLabel.setForeground(new Color(0, 128, 0)); // Green
                } else {
                    availabilityLabel.setText("Not Available");
                    availabilityLabel.setForeground(Color.RED);
                }
            }
        }
    }

    private void clearForm() {
        patientNameField.setText("");
        doctorComboBox.setSelectedIndex(0); // Changed from -1 to 0 to avoid potential null references
        serviceComboBox.setSelectedIndex(0); // Changed from -1 to 0
        dateSpinner.setValue(new java.util.Date());
        timeSpinner.setValue(new java.util.Date());
        statusComboBox.setSelectedIndex(0);

        // Reset availability label
        if (availabilityLabel != null) {
            availabilityLabel.setText("Unknown");
            availabilityLabel.setForeground(Color.GRAY);
        }
    }
}