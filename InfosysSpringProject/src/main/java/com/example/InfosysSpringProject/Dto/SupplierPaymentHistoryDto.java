package com.example.InfosysSpringProject.Dto;

import lombok.Data;

@Data
public class SupplierPaymentHistoryDto {
    private Long paymentId;
    private Long requestId;
    private String productName;
    private Integer quantity;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;

    public SupplierPaymentHistoryDto(Long paymentId, Long requestId, String productName, Integer quantity, Double amount, String paymentMethod, String paymentStatus) {
    }

    public SupplierPaymentHistoryDto() {

    }
}
