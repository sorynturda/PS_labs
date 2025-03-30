package com.example.medcare.presentation;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.Time;
import java.util.List;
import com.example.medcare.model.entity.Schedule;
import com.example.medcare.service.ScheduleService;

public class ScheduleWindow extends JFrame {
    private ScheduleService scheduleService;
    private JTable scheduleTable;
    private DefaultTableModel tableModel;
    private JButton addScheduleButton, editScheduleButton;
    private int doctorId;

    public ScheduleWindow(ScheduleService scheduleService, int doctorId) {
        this.scheduleService = scheduleService;
        this.doctorId = doctorId;

        setTitle("Doctor Schedule");
        setSize(600, 400);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        setLocationRelativeTo(null);

        // Table setup
        String[] columnNames = {"ID", "Day of Week", "Start Time", "End Time"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        scheduleTable = new JTable(tableModel);
        scheduleTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        add(new JScrollPane(scheduleTable), BorderLayout.CENTER);

        // Buttons
        addScheduleButton = new JButton("Add Schedule");
        addScheduleButton.addActionListener(e -> {
            try {
                showAddScheduleDialog();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        });

        editScheduleButton = new JButton("Edit Schedule");
        editScheduleButton.addActionListener(e -> {
            try {
                showEditScheduleDialog();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        });

        JPanel bottomPanel = new JPanel();
        bottomPanel.add(addScheduleButton);
        bottomPanel.add(editScheduleButton);
        add(bottomPanel, BorderLayout.SOUTH);

        loadScheduleData();
        setVisible(true);
    }

    private void loadScheduleData() {
        tableModel.setRowCount(0);
        List<Schedule> schedules = scheduleService.getSchedulesByDoctorId(doctorId);
        for (Schedule schedule : schedules) {
            tableModel.addRow(new Object[]{
                schedule.getId(),
                schedule.getDayOfTheWeek(),
                schedule.getStartTime(),
                schedule.getEndTime()
            });
        }
    }

    private void showAddScheduleDialog() throws Exception {
        JTextField dayField = new JTextField();
        JTextField startTimeField = new JTextField();
        JTextField endTimeField = new JTextField();

        JPanel panel = new JPanel(new GridLayout(3, 2));
        panel.add(new JLabel("Day of Week:"));
        panel.add(dayField);
        panel.add(new JLabel("Start Time:"));
        panel.add(startTimeField);
        panel.add(new JLabel("End Time:"));
        panel.add(endTimeField);

        int result = JOptionPane.showConfirmDialog(this, panel, "Add Schedule", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            String dayOfTheWeek = dayField.getText();
            String startTime = startTimeField.getText();
            String endTime = endTimeField.getText();
            try {
                scheduleService.addSchedule(doctorId, dayOfTheWeek, Time.valueOf(startTime), Time.valueOf(endTime));
            } catch (Exception e) {
                throw new Exception("Please fill the fields with valid values!  ");
            }
            loadScheduleData();
        }
    }

    private void showEditScheduleDialog() throws Exception {
        int selectedRow = scheduleTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a schedule to edit.", "No Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int scheduleId = (int) tableModel.getValueAt(selectedRow, 0);
        String dayOfWeek = (String) tableModel.getValueAt(selectedRow, 1);
        String startTime = String.valueOf(tableModel.getValueAt(selectedRow, 2));
        String endTime = String.valueOf(tableModel.getValueAt(selectedRow, 3));

        JTextField dayField = new JTextField(dayOfWeek);
        JTextField startTimeField = new JTextField(startTime);
        JTextField endTimeField = new JTextField(endTime);

        JPanel panel = new JPanel(new GridLayout(3, 2));
        panel.add(new JLabel("Day of Week:"));
        panel.add(dayField);
        panel.add(new JLabel("Start Time:"));
        panel.add(startTimeField);
        panel.add(new JLabel("End Time:"));
        panel.add(endTimeField);

        int result = JOptionPane.showConfirmDialog(this, panel, "Edit Schedule", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            scheduleService.updateSchedule(scheduleId, doctorId, dayField.getText(), Time.valueOf(startTimeField.getText()), Time.valueOf(endTimeField.getText()));
            loadScheduleData();
        }
    }
}
