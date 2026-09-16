package com.example.InfosysSpringProject.Dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequestDto {

    private String cardHolderName;
    private String cardNumber;
    private String expiryDate;
    private String cvv;

}
