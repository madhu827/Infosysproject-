package com.example.InfosysSpringProject.Entity;

import com.example.InfosysSpringProject.Enum.Role;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Manager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long managerId;

    @Column(nullable = false)
    private String managerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(name = "pin")
    private String pin;


    @ManyToOne
    @JoinColumn(name = "departmentId")
    private Department department;
}

