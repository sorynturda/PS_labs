package com.medcare.dto;

import com.medcare.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private User.UserRole role;
} 