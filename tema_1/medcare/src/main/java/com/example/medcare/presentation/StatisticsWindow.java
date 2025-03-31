package com.example.medcare.presentation;

import com.example.medcare.model.entity.Appointment; // Assuming you have an Appointment model
import com.example.medcare.model.entity.Doctor;      // Assuming you have a Doctor model
import com.example.medcare.model.entity.MedicalService; // Assuming you have a MedicalService model
import com.example.medcare.service.AppointmentService;
import com.example.medcare.service.DoctorService;
import com.example.medcare.service.MedicalServiceService;
import com.example.medcare.util.WriteCSV;
import lombok.Locked;

import javax.print.Doc;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.List;

public class StatisticsWindow extends JFrame {
    private final DoctorService doctorService;
    private final MedicalServiceService medicalServiceService;
    private final AppointmentService appointmentService;

    // UI Components
    private JComboBox<Integer> startDayCombo, startMonthCombo, startYearCombo;
    private JComboBox<Integer> endDayCombo, endMonthCombo, endYearCombo;
    private JButton showStatisticsButton;
    private JTable appointmentsTable;
    private JTable topDoctorsTable;
    private JTable topServicesTable;
    private DefaultTableModel appointmentsTableModel;
    private DefaultTableModel topDoctorsTableModel;
    private DefaultTableModel topServicesTableModel;

    // Constants for date ranges
    private static final int CURRENT_YEAR = Year.now().getValue();
    private static final int START_YEAR = CURRENT_YEAR - 10; // Look back 10 years
    private static final int END_YEAR = CURRENT_YEAR + 5;    // Look forward 5 years

    public StatisticsWindow(DoctorService doctorService, MedicalServiceService medicalServiceService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.medicalServiceService = medicalServiceService;
        this.appointmentService = appointmentService;

        setTitle("Statistics");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Close only this window
        setSize(800, 600);
        setLocationRelativeTo(null); // Center on screen

        initComponents();
        layoutComponents();
        addEventListeners();
        setVisible(true);
    }

    private void initComponents() {
        // --- Date Components ---
        // Start Date
        startDayCombo = createDayComboBox();
        startMonthCombo = createMonthComboBox();
        startYearCombo = createYearComboBox();

        // End Date
        endDayCombo = createDayComboBox();
        endMonthCombo = createMonthComboBox();
        endYearCombo = createYearComboBox();

        // Set default dates (e.g., start of month to today)
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        startDayCombo.setSelectedItem(startOfMonth.getDayOfMonth());
        startMonthCombo.setSelectedItem(startOfMonth.getMonthValue());
        startYearCombo.setSelectedItem(startOfMonth.getYear());
        endDayCombo.setSelectedItem(today.getDayOfMonth());
        endMonthCombo.setSelectedItem(today.getMonthValue());
        endYearCombo.setSelectedItem(today.getYear());


        // --- Button ---
        showStatisticsButton = new JButton("Show Reports");

        // --- Tables ---
        // Appointments Table
        String[] appointmentColumns = {"Date", "Patient", "Doctor", "Service", "Price"}; // Example columns
        appointmentsTableModel = new DefaultTableModel(appointmentColumns, 0); // 0 rows initially
        appointmentsTable = new JTable(appointmentsTableModel);
        appointmentsTable.setFillsViewportHeight(true);

        // Top Doctors Table
        String[] doctorColumns = {"Doctor", "Specialization", "No. Appointments"};
        topDoctorsTableModel = new DefaultTableModel(doctorColumns, 0);
        topDoctorsTable = new JTable(topDoctorsTableModel);
        topDoctorsTable.setFillsViewportHeight(true);

        // Top Services Table
        String[] serviceColumns = {"Name", "Price", "Duration", "No. Appointments"};
        topServicesTableModel = new DefaultTableModel(serviceColumns, 0);
        topServicesTable = new JTable(topServicesTableModel);
        topServicesTable.setFillsViewportHeight(true);

    }

    private void layoutComponents() {
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10)); // Main panel with border layout
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10)); // Add padding

        // --- Top Panel for Controls ---
        JPanel controlPanel = new JPanel();
        // Use GridBagLayout for more control over alignment
        controlPanel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5); // Padding between components
        gbc.anchor = GridBagConstraints.WEST; // Align components to the left

        // Start Date Label and Combos
        gbc.gridx = 0;
        gbc.gridy = 0;
        controlPanel.add(new JLabel("Start Date"), gbc);
        gbc.gridx = 1;
        controlPanel.add(startDayCombo, gbc);
        gbc.gridx = 2;
        controlPanel.add(startMonthCombo, gbc);
        gbc.gridx = 3;
        controlPanel.add(startYearCombo, gbc);

        // End Date Label and Combos
        gbc.gridx = 0;
        gbc.gridy = 1;
        controlPanel.add(new JLabel("End Date:"), gbc);
        gbc.gridx = 1;
        controlPanel.add(endDayCombo, gbc);
        gbc.gridx = 2;
        controlPanel.add(endMonthCombo, gbc);
        gbc.gridx = 3;
        controlPanel.add(endYearCombo, gbc);

        // Button (spans across some columns for better placement)
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 4; // Span across 4 columns
        gbc.anchor = GridBagConstraints.CENTER; // Center the button
        controlPanel.add(showStatisticsButton, gbc);

        mainPanel.add(controlPanel, BorderLayout.NORTH);

        // --- Center Panel for Tables ---
        JPanel tablesPanel = new JPanel();
        tablesPanel.setLayout(new BoxLayout(tablesPanel, BoxLayout.Y_AXIS)); // Stack tables vertically

        // Appointments Table Section
        tablesPanel.add(new JLabel("Appointments between selected dates:"));
        tablesPanel.add(new JScrollPane(appointmentsTable));
        tablesPanel.add(Box.createRigidArea(new Dimension(0, 10))); // Spacer

        // Top Doctors Table Section
        tablesPanel.add(new JLabel("The most requested doctors"));
        tablesPanel.add(new JScrollPane(topDoctorsTable));
        tablesPanel.add(Box.createRigidArea(new Dimension(0, 10))); // Spacer

        // Top Services Table Section
        tablesPanel.add(new JLabel("The most requested medical services:"));
        tablesPanel.add(new JScrollPane(topServicesTable));

        mainPanel.add(tablesPanel, BorderLayout.CENTER);

        // Add main panel to the frame
        add(mainPanel);
    }

    private void addEventListeners() {
        showStatisticsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                fetchAndDisplayStatistics();
            }
        });

        // Optional: Add listeners to month/year combos to update day combo dynamically
        // (e.g., Feb has 28/29 days, April has 30)
        ActionListener dateChangeListener = e -> updateDayComboBox();
        startMonthCombo.addActionListener(dateChangeListener);
        startYearCombo.addActionListener(dateChangeListener);
        endMonthCombo.addActionListener(dateChangeListener);
        endYearCombo.addActionListener(dateChangeListener);
    }

    private void fetchAndDisplayStatistics() {
        Date startDate = getDateFromComboBoxes(startDayCombo, startMonthCombo, startYearCombo, "start");
        Date endDate = getDateFromComboBoxes(endDayCombo, endMonthCombo, endYearCombo, "end");

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        if (startDate == null || endDate == null) {
            // Error message handled in getDateFromComboBoxes
            return;
        }

        if (startDate.after(endDate)) {
            JOptionPane.showMessageDialog(this,
                    "Start date cannot be after end date.",
                    "Date error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Clear existing table data
        appointmentsTableModel.setRowCount(0);
        topDoctorsTableModel.setRowCount(0);
        topServicesTableModel.setRowCount(0);

        try {

            List<Appointment> appointments = appointmentService.getAppointmentsBetweenDates(startDate, endDate);

            if (!appointments.isEmpty()) {
                for (Appointment app : appointments) {
                    Vector<Object> row = new Vector<>();
                    row.add(app.getDate_() != null ?
                            app.getDate_() : "N/A");
                    row.add(app.getPatientName() != null ? app.getPatientName() : "N/A"); // Assuming Patient object with getName()
                    row.add(app.getDoctor() != null ? app.getDoctor().getName() : "N/A"); // Assuming Doctor object with getName()
                    row.add(app.getService() != null ? app.getService().getName() : "N/A"); // Assuming MedicalService object with getName()
                    row.add(app.getService() != null ? app.getService().getPrice() : "N/A");
                    appointmentsTableModel.addRow(row);
                }
            }

            ArrayList<String[]> data = new ArrayList<>();
            data.add(new String[]{
                    "id", "doctor_id", "patient_name", "date", "time", "service_name"
            });
            for (Appointment ap : appointments) {
                String[] singleData = {
                        String.valueOf(ap.getId()),
                        String.valueOf(ap.getDoctor().getId()),
                        ap.getPatientName(),
                        ap.getDate_().toString(),
                        ap.getTime().toString(),
                        ap.getService().getName()
                };
                data.add(singleData);
            }
            String fileName = "./appointments_" + formatter.format(startDate) + "_" + formatter.format(endDate) + "_.csv";
            WriteCSV.writeDataAtOnce(fileName, data);


            data.clear();
            data.add(new String[]{"id", "name", "specialization", "times"});
            Map<Doctor, Long> topDoctors = appointmentService.getMostRequestedDoctors(10, startDate, endDate); // Get top 10
            for (Map.Entry<Doctor, Long> entry : topDoctors.entrySet()) {
                Doctor doc = entry.getKey();
                Long count = entry.getValue();
                Vector<Object> row = new Vector<>();
                row.add(doc.getName());
                row.add(doc.getSpecialization());
                row.add(count);
                topDoctorsTableModel.addRow(row);

                String[] singleData = {
                        String.valueOf(doc.getId()),
                        doc.getName(),
                        doc.getSpecialization(),
                        String.valueOf(count)
                };
                data.add(singleData);
            }

            fileName = "./most_requested_doctors" + formatter.format(startDate) + "_" + formatter.format(endDate) + "_.csv";
            WriteCSV.writeDataAtOnce(fileName, data);

            Map<MedicalService, Long> topServices = appointmentService.getMostRequestedServices(10, startDate, endDate); // Get top 10

            data.clear();
            data.add(new String[]{"id", "service_name", "price", "duration_in_minutes", "times"});

            for (Map.Entry<MedicalService, Long> entry : topServices.entrySet()) {
                MedicalService service = entry.getKey();
                Long count = entry.getValue();
                Vector<Object> row = new Vector<>();
                row.add(service.getName());
                row.add(service.getPrice());
                row.add(service.getDurationMinutes());
                row.add(count);
                topServicesTableModel.addRow(row);

                String[] singleData = {
                        String.valueOf(service.getId()),
                        service.getName(),
                        String.valueOf(service.getPrice()),
                        String.valueOf(service.getDurationMinutes()),
                        String.valueOf(count)
                };
                data.add(singleData);
            }

            fileName = "./most_requested_services" + formatter.format(startDate) + "_" + formatter.format(endDate) + "_.csv";
            WriteCSV.writeDataAtOnce(fileName, data);


        } catch (Exception ex) {
            // Handle exceptions from service layer (e.g., database connection issues)
            JOptionPane.showMessageDialog(this,
                    "A apărut o eroare la preluarea statisticilor: " + ex.getMessage(),
                    "Eroare Serviciu", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace(); // Log the full error for debugging
        }
    }

    // --- Helper Methods for Date ComboBoxes ---

    private JComboBox<Integer> createDayComboBox() {
        JComboBox<Integer> comboBox = new JComboBox<>();
        for (int i = 1; i <= 31; i++) {
            comboBox.addItem(i);
        }
        return comboBox;
    }

    private JComboBox<Integer> createMonthComboBox() {
        JComboBox<Integer> comboBox = new JComboBox<>();
        for (int i = 1; i <= 12; i++) {
            comboBox.addItem(i);
        }
        return comboBox;
    }

    private JComboBox<Integer> createYearComboBox() {
        JComboBox<Integer> comboBox = new JComboBox<>();
        for (int i = START_YEAR; i <= END_YEAR; i++) {
            comboBox.addItem(i);
        }
        comboBox.setSelectedItem(CURRENT_YEAR); // Default to current year
        return comboBox;
    }

    // Helper to get Date object from combo boxes, with basic validation
    private Date getDateFromComboBoxes(JComboBox<Integer> dayCombo, JComboBox<Integer> monthCombo, JComboBox<Integer> yearCombo, String dateType) {
        try {
            int day = (Integer) dayCombo.getSelectedItem();
            int month = (Integer) monthCombo.getSelectedItem();
            int year = (Integer) yearCombo.getSelectedItem();

            // Basic validation using LocalDate to catch invalid dates like Feb 30
            LocalDate localDate = LocalDate.of(year, month, day);

            // Convert LocalDate to Date (for compatibility if needed, services might use Date)
            // If services use LocalDate, return localDate directly.
            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        } catch (NullPointerException ex) {
            JOptionPane.showMessageDialog(this,
                    "Select a valid value (" + dateType + ").",
                    "Incomplete date", JOptionPane.ERROR_MESSAGE);
            return null;
        } catch (Exception ex) { // Catches DateTimeException for invalid dates like Feb 30
            String dateStr = String.format("%s/%s/%s", dayCombo.getSelectedItem(), monthCombo.getSelectedItem(), yearCombo.getSelectedItem());
            JOptionPane.showMessageDialog(this,
                    "Selected " + dateType + " date (" + dateStr + ") is not valid.",
                    "Invalid date error", JOptionPane.ERROR_MESSAGE);
            return null;
        }
    }

    // Helper method to adjust the number of days based on month/year selection
    private void updateDayComboBox() {
        // Simple update - assumes all months can have 31 days for now.
        // A more sophisticated version would adjust days based on month and leap year.
        // This is less critical if using LocalDate validation as done in getDateFromComboBoxes.
        // For a truly accurate UI, you'd recalculate the max days for the selected month/year
        // and potentially reset the selected day if it becomes invalid (e.g., switching
        // from March 31st to February).
//        System.out.println("Date changed, day combo box update logic could be added here.");
    }
}
