package com.example.medcare.model.entity;

import com.example.medcare.util.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "users")
@Entity
@AllArgsConstructor
public class User {
    public User(){}

    public User(String name, String username, String passwordHash, String role_) {
        this.name = name;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role_ = role_;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name= "role_", nullable = false)
    private String role_= String.valueOf(UserRole.USER);

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole_() {
        return role_;
    }

    public void setRole_(String role_) {
        this.role_ = role_;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", role_='" + role_ + '\'' +
                '}';
    }
}
