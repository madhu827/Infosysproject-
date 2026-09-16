package com.example.InfosysSpringProject.Entity;


import com.example.InfosysSpringProject.Enum.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @NotBlank(message = "userName is required")
    @Size(min = 4, max = 20)
    private String userName;

    @NotBlank(message = "user_password is required")
    @Size(min = 4, max = 200)
    private String user_password;

    @NotBlank(message = "user_phoneno is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "enter valid 10-digit mobile number"
    )
    private String user_phoneno;

    @NotBlank(message = "user_email is required")
    @Email(message = "enter valid email")
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @NotBlank(message = "user_designation is required")
    @Size(max = 40)
    private String designation;

    @NotNull(message = "department is required")
    @ManyToOne
    @JoinColumn(name="department_id",referencedColumnName = "departmentId")
    private Department department;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;
}