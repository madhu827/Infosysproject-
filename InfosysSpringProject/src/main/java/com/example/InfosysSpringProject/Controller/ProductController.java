package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.ProductDto;
import com.example.InfosysSpringProject.Dto.ProductResponseDto;
import com.example.InfosysSpringProject.Dto.SupplierProductDto;
import com.example.InfosysSpringProject.Entity.Product;
import com.example.InfosysSpringProject.Service.ProductService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;


    // ============================================================
    // ADD PRODUCT
    // ============================================================
    @PreAuthorize("hasRole('SUPPLIER')")
    @PostMapping
    public ResponseEntity<?> addProduct(
            @Valid @RequestBody ProductDto dto) {

        try {

            Product product =
                    productService.addProduct(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(product);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================

    @PreAuthorize("hasAnyRole('USER','MANAGER')")
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts(
            Authentication authentication
    ) {

        List<ProductResponseDto> products =
                productService.getProductsForUser(
                        authentication
                );

        return ResponseEntity.ok(products);
    }


    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    productService.getProductById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<SupplierProductDto>> getProductsBySupplierId(
            @PathVariable Long supplierId) {

        List<SupplierProductDto> products =
                productService.getProductsBySupplierId(supplierId);

        return ResponseEntity.ok(products);
    }
}