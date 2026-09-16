package com.example.InfosysSpringProject.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerRegisterDto {

    private String managerName;

    private String email;

    private String password;

    private String department;
}