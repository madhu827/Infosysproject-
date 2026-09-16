package com.example.InfosysSpringProject.Dto;

import lombok.Data;

@Data
public class UserRegisterDto {

    private String userName;
    private String user_password;
    private String email;
    private String user_phoneno;
    private String designation;

    private String department;


}