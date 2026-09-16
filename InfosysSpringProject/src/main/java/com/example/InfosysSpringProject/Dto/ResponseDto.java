package com.example.InfosysSpringProject.Dto;

import lombok.Data;

@Data
public class ResponseDto {
    private Long requestId;
    private Long userId;
    private Long departmentId;
    private String productName;
    private Double productPrice;
    private Integer quantity;
    private Double totalPrice;
}
