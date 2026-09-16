package com.example.InfosysSpringProject.Dto;


import com.example.InfosysSpringProject.Enum.ReturnReason;
import lombok.Data;

@Data
public class ReturnRequestDto {

    private Long purchaseRequestId;

    private Long managerId;

    private Long supplierId;

    private ReturnReason reason;

    private String description;



}
