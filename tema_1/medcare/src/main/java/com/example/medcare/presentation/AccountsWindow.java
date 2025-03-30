package com.example.medcare.presentation;

import com.example.medcare.model.entity.User;
import com.example.medcare.service.UserService;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class AccountsWindow extends JFrame {
    private JTable accountsTable;
    private DefaultTableModel tableModel;
    private UserService userService;
    String[] columnNames = {"ID", "Name", "Username", "Role"};

    public AccountsWindow(UserService userService) {
        this.userService = userService;

        setTitle("Manage Accounts");
        setSize(500, 300);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());

        // Define table columns
        tableModel = new DefaultTableModel(columnNames, 0);
        accountsTable = new JTable(tableModel);
        add(new JScrollPane(accountsTable), BorderLayout.CENTER);
        populateTable();

        // Panel for adding new user
        JPanel formPanel = new JPanel(new GridLayout(5, 2));
        JTextField nameField = new JTextField();
        JTextField usernameField = new JTextField();
        JPasswordField passwordField = new JPasswordField();
        JButton createButton = new JButton("Create Account");
        JButton removeUser = new JButton("Remove User");

        formPanel.add(new JLabel("Name:"));
        formPanel.add(nameField);
        formPanel.add(new JLabel("Username:"));
        formPanel.add(usernameField);
        formPanel.add(new JLabel("Password:"));
        formPanel.add(passwordField);
        formPanel.add(new JLabel(""));
        formPanel.add(createButton);
        formPanel.add(removeUser);

        add(formPanel, BorderLayout.SOUTH);

        removeUser.addActionListener(e ->{
            if(accountsTable.getSelectedRow() != -1){
                Object id = tableModel.getValueAt(accountsTable.getSelectedRow(), 0);
                userService.removeUser((Integer) id);
                populateTable();
            }
        });
        createButton.addActionListener(e -> {
            String name = nameField.getText();
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            if (!name.isEmpty() && !username.isEmpty() && !password.isEmpty()) {
                try {
                    userService.createUser(name, username, password);
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(this, "Username already exists!", "Error", JOptionPane.ERROR_MESSAGE);
                }
                finally {
                    populateTable();
                }

            } else {
                JOptionPane.showMessageDialog(this, "All fields must be filled!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        setVisible(true);
    }


    private void populateTable() {
        tableModel = new DefaultTableModel(columnNames, 0);
        List<User> users = userService.getAllUsers();
        for (User u : users) {
            Object[] rowData = {u.getId(), u.getName(), u.getUsername(), u.getRole_()};
            tableModel.addRow(rowData);
        }
        accountsTable.setModel(tableModel);
    }
}