package com.example.InfosysSpringProject.Dto;

import lombok.Data;

@Data
public class SupplierRegisterDto {

    private String suppliername;

    private String email;

    private String password;

    private String phone;

    private String address;

    private String gstNumber;

    private String productType;
}