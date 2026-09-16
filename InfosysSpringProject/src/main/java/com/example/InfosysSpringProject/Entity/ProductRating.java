package com.example.InfosysSpringProject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class ProductRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @ManyToOne
    @JoinColumn(name = "product_id",referencedColumnName = "productId")
    @NotNull(message = "Product is required")
    private Product product;


    @NotNull(message = "requestId is not null")
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "manager_id", referencedColumnName = "managerId")
    @NotNull(message = "Manager is required")
    private Manager manager;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(
            min = 5,
            max = 500,
            message = "Comment must be between 5 and 500 characters"
    )
    private String comment;

    @NotNull(message = "Created date is required")
    private LocalDateTime createdAt;


}