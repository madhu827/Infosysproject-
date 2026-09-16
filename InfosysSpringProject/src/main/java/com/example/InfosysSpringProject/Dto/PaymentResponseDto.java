package com.example.InfosysSpringProject.Dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponseDto {
    private Long paymentId;

    private Long requestId;

    private Double amount;

    private String paymentMethod;

    private String paymentType;

    private String paymentStatus;

    private boolean verified;

    private LocalDateTime paymentDate;

    private String transactionId;
}
