package com.example.InfosysSpringProject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class Approval_hierarchy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long approval_id;

    @NotNull(message = "level is required")
    @Min(value = 1,message = "levle must be atleast 1")
    @Max(value = 10,message = "level cannot exceed 10")
    private Integer level;


    @NotNull(message = "deparment is required")
    @ManyToOne
    @JoinColumn(name = "department_id",referencedColumnName = "departmentId")
    private Department department;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

}
