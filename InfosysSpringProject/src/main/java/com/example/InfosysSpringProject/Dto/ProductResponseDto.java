package com.example.InfosysSpringProject.Dto;

import lombok.Data;

@Data
public class ProductResponseDto {

    private Long productId;
    private String productName;
    private Double product_price;
    private String description;
    private String imageUrl;

    // getters and setters
}