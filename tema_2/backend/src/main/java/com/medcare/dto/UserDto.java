package com.medcare.dto;

import com.medcare.model.User;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String fullName;
    private User.UserRole role;
} 