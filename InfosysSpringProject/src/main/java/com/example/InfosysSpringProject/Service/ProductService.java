package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.ProductDto;
import com.example.InfosysSpringProject.Dto.ProductResponseDto;
import com.example.InfosysSpringProject.Dto.SupplierProductDto;
import com.example.InfosysSpringProject.Entity.*;
import com.example.InfosysSpringProject.Enum.RequestStatus;
import com.example.InfosysSpringProject.Repository.*;

import jakarta.validation.Valid;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;


    // ============================================================
    // ADD PRODUCT
    // ============================================================

    public Product addProduct(@Valid ProductDto dto) {

        // ============================================================
        // 1. CHECK DTO
        // ============================================================

        if (dto == null) {
            throw new RuntimeException("Product data is required");
        }


        // ============================================================
        // 2. GET LOGGED-IN SUPPLIER
        // ============================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {

            throw new RuntimeException(
                    "Supplier is not logged in"
            );
        }


        // ============================================================
        // 3. GET SUPPLIER EMAIL
        // ============================================================

        String email = authentication.getName();

        if (email == null || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Unable to identify logged-in supplier"
            );
        }

        email = email.trim();


        // ============================================================
        // 4. FIND SUPPLIER
        // ============================================================

        String finalEmail = email;
        Supplier supplier =
                supplierRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found with email: "
                                                + finalEmail
                                )
                        );


        // ============================================================
        // 5. VALIDATE PRODUCT NAME
        // ============================================================

        if (dto.getProductName() == null ||
                dto.getProductName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product name is required"
            );
        }


        // ============================================================
        // 6. VALIDATE DEPARTMENT
        // ============================================================

        if (dto.getDepartment() == null ||
                dto.getDepartment().trim().isEmpty()) {

            throw new RuntimeException(
                    "Department is required"
            );
        }

        String departmentName =
                dto.getDepartment().trim();


        // ============================================================
        // 7. FIND DEPARTMENT
        // ============================================================

        Department department =
                departmentRepository
                        .findByDepartmentNameIgnoreCase(
                                departmentName
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found: "
                                                + departmentName
                                )
                        );


        // ============================================================
        // 8. VALIDATE CATEGORY
        // ============================================================

        if (dto.getCategory() == null ||
                dto.getCategory().trim().isEmpty()) {

            throw new RuntimeException(
                    "Category name is required"
            );
        }

        String categoryName =
                dto.getCategory().trim();


        // ============================================================
        // 9. CREATE NEW CATEGORY
        // ============================================================

        Category category = new Category();

        category.setCategoryName(categoryName);

        category.setDepartment(department);

        category =
                categoryRepository.save(category);


        // ============================================================
        // 10. CREATE PRODUCT
        // ============================================================

        Product product = new Product();


        // ============================================================
        // 11. PRODUCT NAME
        // ============================================================

        product.setProductName(
                dto.getProductName().trim()
        );


        // ============================================================
        // 12. PRODUCT PRICE
        // ============================================================

        product.setProduct_price(
                dto.getProduct_price()
        );


        // ============================================================
        // 13. PRODUCT QUANTITY
        // ============================================================

        product.setProductQuantity(
                dto.getProductQuantity()
        );


        // ============================================================
        // 14. DESCRIPTION
        // ============================================================

        if (dto.getDescription() != null) {

            product.setDescription(
                    dto.getDescription().trim()
            );
        }


        // ============================================================
        // 15. IMAGE URL
        // ============================================================

        if (dto.getImageUrl() != null &&
                !dto.getImageUrl().trim().isEmpty()) {

            product.setImageUrl(
                    dto.getImageUrl().trim()
            );
        }


        // ============================================================
        // 16. SET SUPPLIER
        // ============================================================

        product.setSupplier(supplier);


        // ============================================================
        // 17. SET DEPARTMENT
        // ============================================================

        product.setDepartment(department);


        // ============================================================
        // 18. SET CATEGORY
        // ============================================================

        product.setCategory(category);


        // ============================================================
        // 19. SET STATUS
        // ============================================================

        product.setRequestStatus(
                RequestStatus.PENDING
        );


        // ============================================================
        // 20. SAVE PRODUCT
        // ============================================================

        Product savedProduct =
                productRepository.save(product);


        // ============================================================
        // 21. RETURN PRODUCT
        // ============================================================

        return savedProduct;
    }


    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================

    public Product getProductById(Long id) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }

    public List<ProductResponseDto> getProductsForUser(
            Authentication authentication
    ) {

        // --------------------------------------------------------
        // GET LOGGED-IN USER EMAIL
        // --------------------------------------------------------

        String email = authentication.getName();


        // --------------------------------------------------------
        // FIND USER
        // --------------------------------------------------------

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );


        // --------------------------------------------------------
        // GET USER DEPARTMENT
        // --------------------------------------------------------

        Department department = user.getDepartment();

        if (department == null) {

            throw new RuntimeException(
                    "Department is not assigned to this user."
            );
        }


        // --------------------------------------------------------
        // GET DEPARTMENT NAME
        // --------------------------------------------------------

        String departmentName =
                department.getDepartmentName();


        // --------------------------------------------------------
        // FIND PRODUCTS BELONGING TO SAME DEPARTMENT
        // --------------------------------------------------------

        List<Product> products =
                productRepository
                        .findByDepartment_DepartmentName(
                                departmentName
                        );


        // --------------------------------------------------------
        // CONVERT PRODUCT → DTO
        // --------------------------------------------------------

        return products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    // ============================================================
    // CONVERT PRODUCT ENTITY TO RESPONSE DTO
    // ============================================================

    private ProductResponseDto convertToDto(Product product) {

        ProductResponseDto dto =
                new ProductResponseDto();

        dto.setProductId(
                product.getProductId()
        );

        dto.setProductName(
                product.getProductName()
        );

        dto.setProduct_price(
                product.getProduct_price()
        );

        dto.setDescription(
                product.getDescription()
        );

        dto.setImageUrl(
                product.getImageUrl()
        );

        return dto;
    }

    // GET PRODUCTS OF SUPPLIER
    // =========================================================
    public List<SupplierProductDto> getProductsBySupplierId(Long supplierId) {

        List<Product> products =
                productRepository.findProductsBySupplierId(supplierId);

        return products.stream().map(product -> {

            SupplierProductDto dto = new SupplierProductDto();

            dto.setProductName(product.getProductName());
            dto.setProduct_price(product.getProduct_price());
            dto.setProductQuantity(product.getProductQuantity());
            dto.setDescription(product.getDescription());
            dto.setImageUrl(product.getImageUrl());

            return dto;

        }).toList();
    }
}
