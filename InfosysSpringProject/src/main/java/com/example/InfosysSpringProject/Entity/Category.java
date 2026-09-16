package com.example.InfosysSpringProject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long category_id;

    @NotBlank(message = "category_name is required")
    @Size(min=4,max=50)
    private String categoryName;

    @NotNull(message = "department is required")
    @ManyToOne
    @JoinColumn(name="department_id",referencedColumnName = "departmentId")
    private Department department;
}
