package com.example.medcare.entity;

import com.example.medcare.util.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "users")
@Entity
@Data
@ToString
@NoArgsConstructor
public class User {

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
}
