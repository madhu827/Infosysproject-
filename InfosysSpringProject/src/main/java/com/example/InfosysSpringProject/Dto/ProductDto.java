package com.example.InfosysSpringProject.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductDto {

    // =========================================================
    // PRODUCT NAME
    // =========================================================

    @NotBlank(message = "Product name is required")
    @Size(
            min = 4,
            max = 20,
            message = "Product name must be between 4 and 20 characters"
    )
    private String productName;


    // =========================================================
    // PRODUCT PRICE
    // =========================================================

    @NotNull(message = "Product price is required")
    @Positive(message = "Product price must be greater than 0")
    private Double product_price;


    // =========================================================
    // PRODUCT QUANTITY
    // =========================================================

    @NotNull(message = "Product quantity is required")
    @Positive(message = "Product quantity must be at least 1")
    private Integer productQuantity;


    // =========================================================
    // DESCRIPTION
    // =========================================================

    @NotBlank(message = "Description is required")
    @Size(
            min = 4,
            max = 100,
            message = "Description must be between 4 and 100 characters"
    )
    private String description;


    // =========================================================
    // IMAGE URL
    // =========================================================

    private String imageUrl;


    // =========================================================
    // CATEGORY NAME
    // =========================================================

    @NotBlank(message = "Category is required")
    private String category;


    // =========================================================
    // DEPARTMENT NAME
    // =========================================================

    @NotBlank(message = "Department is required")
    private String department;
}