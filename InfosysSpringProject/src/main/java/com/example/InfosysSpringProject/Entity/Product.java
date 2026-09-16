package com.example.InfosysSpringProject.Entity;

import com.example.InfosysSpringProject.Enum.RequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank(message = "product_name is required")
    @Size(min = 4, max = 20)
    private String productName;

    @NotNull(message = "product_price is required")
    @Positive(message = "product_price is greater than 0")
    private Double product_price;

    @NotNull(message = "product_quantity is required")
    @Positive(message = "product_quantity is atleast 1")
    private Integer productQuantity;

    @NotBlank(message = "description is required")
    @Size(min = 4, max = 1000)
    private String description;

    @NotBlank(message = "image URL is required")
    private String imageUrl;

    @NotNull(message = "status is required")
    @Enumerated(EnumType.STRING)
    private RequestStatus requestStatus;

    // ==============================
    // SUPPLIER
    // ==============================

    @NotNull(message = "supplier is required")
    @ManyToOne
    @JoinColumn(name = "supplierId")
    private Supplier supplier;

    // ==============================
    // CREATED / UPDATED
    // ==============================

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    // ==============================
    // DEPARTMENT
    // ==============================

    @NotNull(message = "department is required")
    @ManyToOne
    @JoinColumn(
            name = "department_id",
            referencedColumnName = "departmentId"
    )
    private Department department;

    // ==============================
    // CATEGORY
    // ==============================

    @NotNull(message = "category is required")
    @ManyToOne
    @JoinColumn(
            name = "category_id",
            referencedColumnName = "category_id"
    )
    private Category category;
}