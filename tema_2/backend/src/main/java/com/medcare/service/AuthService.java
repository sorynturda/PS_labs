package com.medcare.service;

import com.medcare.dto.LoginRequest;
import com.medcare.dto.LoginResponse;
import com.medcare.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    void register(RegisterRequest registerRequest);
} 