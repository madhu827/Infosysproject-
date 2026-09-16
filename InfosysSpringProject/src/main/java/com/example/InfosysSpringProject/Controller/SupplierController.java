package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.*;
import com.example.InfosysSpringProject.Entity.Supplier;
import com.example.InfosysSpringProject.Repository.SupplierRepository;
import com.example.InfosysSpringProject.Service.SupplierService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import java.util.List;
import jakarta.validation.Valid;


import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/supplier")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(
            SupplierService supplierService) {

        this.supplierService = supplierService;
    }

    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerSupplier(
            @Valid @RequestBody SupplierRegisterDto dto) {

        try {

            Supplier supplier =
                    supplierService.registerSupplier(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(supplier);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // LOGIN
    // =========================================================


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody SupplierLoginDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        // 1. Find supplier by email
        Supplier supplier = supplierRepository
                .findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found")
                );

        // 2. Check password
        if (!passwordEncoder.matches(
                dto.getPassword(),
                supplier.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // 3. Create authentication
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        supplier.getEmail(),
                        null,
                        List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_SUPPLIER"
                                )
                        )
                );

        // 4. Create security context
        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        // 5. Save authentication in HTTP session
        SecurityContextRepository repository =
                new HttpSessionSecurityContextRepository();

        repository.saveContext(
                context,
                request,
                response
        );

        // 6. Return supplier information to React
        return ResponseEntity.ok(supplier);
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(
            @PathVariable Long id) {

        try {

            Supplier supplier =
                    supplierService.getSupplierById(id);

            return ResponseEntity.ok(supplier);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Supplier>>
    getAllSuppliers() {

        return ResponseEntity.ok(
                supplierService.getAllSuppliers()
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(
            @PathVariable Long id) {

        try {

            String message =
                    supplierService.deleteSupplier(id);

            return ResponseEntity.ok(message);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

}