package com.medcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotBlank
    private String patientName;

    @NotNull
    private Long doctorId;

    @NotNull
    private Long serviceId;

    @NotNull
    private LocalDateTime appointmentTime;
} 