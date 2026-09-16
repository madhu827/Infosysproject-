package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.*;
import com.example.InfosysSpringProject.Entity.Payment;
import com.example.InfosysSpringProject.Entity.Product;
import com.example.InfosysSpringProject.Entity.Supplier;
import com.example.InfosysSpringProject.Enum.RequestStatus;
import com.example.InfosysSpringProject.Enum.Role;
import com.example.InfosysSpringProject.Repository.PaymentRepository;
import com.example.InfosysSpringProject.Repository.ProductRepository;
import com.example.InfosysSpringProject.Repository.SupplierRepository;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;


    // =========================================================
    // REGISTER SUPPLIER
    // =========================================================

    public Supplier registerSupplier(
            @Valid SupplierRegisterDto dto) {

        // -----------------------------------------------------
        // CHECK DTO
        // -----------------------------------------------------

        if (dto == null) {

            throw new RuntimeException(
                    "Supplier registration details are required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE SUPPLIER NAME
        // -----------------------------------------------------

        if (dto.getSuppliername() == null ||
                dto.getSuppliername().trim().isEmpty()) {

            throw new RuntimeException(
                    "Supplier name is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (dto.getEmail() == null ||
                dto.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        String email =
                dto.getEmail()
                        .trim()
                        .toLowerCase();


        // =====================================================
        // CHECK EMAIL USING findByEmail()
        // =====================================================

        if (supplierRepository
                .findByEmail(email)
                .isPresent()) {

            throw new RuntimeException(
                    "Supplier with this email already exists"
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (dto.getPassword() == null ||
                dto.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE PHONE
        // -----------------------------------------------------

        if (dto.getPhone() == null ||
                dto.getPhone().trim().isEmpty()) {

            throw new RuntimeException(
                    "Phone number is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE ADDRESS
        // -----------------------------------------------------

        if (dto.getAddress() == null ||
                dto.getAddress().trim().isEmpty()) {

            throw new RuntimeException(
                    "Address is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE PRODUCT TYPE
        // -----------------------------------------------------

        if (dto.getProductType() == null ||
                dto.getProductType().trim().isEmpty()) {

            throw new RuntimeException(
                    "Product type is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE GST NUMBER
        // -----------------------------------------------------

        if (dto.getGstNumber() == null ||
                dto.getGstNumber().trim().isEmpty()) {

            throw new RuntimeException(
                    "GST number is required"
            );
        }


        String gstNumber =
                dto.getGstNumber()
                        .trim()
                        .toUpperCase();


        // =====================================================
        // CREATE SUPPLIER
        // =====================================================

        Supplier supplier =
                new Supplier();


        // -----------------------------------------------------
        // SUPPLIER NAME
        // -----------------------------------------------------

        supplier.setSuppliername(
                dto.getSuppliername().trim()
        );


        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        supplier.setEmail(email);


        // -----------------------------------------------------
        // PHONE
        // -----------------------------------------------------

        supplier.setPhone(
                dto.getPhone().trim()
        );


        // -----------------------------------------------------
        // ADDRESS
        // -----------------------------------------------------

        supplier.setAddress(
                dto.getAddress().trim()
        );


        // -----------------------------------------------------
        // PRODUCT TYPE
        // -----------------------------------------------------

        supplier.setProductType(
                dto.getProductType().trim()
        );


        // -----------------------------------------------------
        // GST NUMBER
        // -----------------------------------------------------

        supplier.setGstNumber(
                gstNumber
        );


        // =====================================================
        // ENCODE PASSWORD
        // =====================================================

        supplier.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );


        // =====================================================
        // DEFAULT RATING
        // =====================================================

        supplier.setRating(0.0);


        // =====================================================
        // DEFAULT FEEDBACK
        // =====================================================

        supplier.setFeedback(
                "No feedback available"
        );


        // =====================================================
        // DEFAULT STATUS
        // =====================================================

        supplier.setStatus(
                RequestStatus.PENDING
        );


        // =====================================================
        // DEFAULT ROLE
        // =====================================================

        supplier.setRole(
                Role.SUPPLIER
        );


        // =====================================================
        // SAVE SUPPLIER
        // =====================================================

        Supplier savedSupplier =
                supplierRepository.save(supplier);


        // =====================================================
        // SEND REGISTRATION EMAIL
        // =====================================================

        try {

            String subject =
                    "Supplier Registration Successful";


            String body =
                    "Hello " +
                            savedSupplier.getSuppliername() +
                            ",\n\n" +

                            "Your supplier account has been successfully registered.\n\n" +

                            "Supplier Name : " +
                            savedSupplier.getSuppliername() +
                            "\n" +

                            "Email         : " +
                            savedSupplier.getEmail() +
                            "\n" +

                            "Phone         : " +
                            savedSupplier.getPhone() +
                            "\n" +

                            "GST Number    : " +
                            savedSupplier.getGstNumber() +
                            "\n" +

                            "Product Type  : " +
                            savedSupplier.getProductType() +
                            "\n" +

                            "Role          : " +
                            savedSupplier.getRole() +
                            "\n" +

                            "Status        : " +
                            savedSupplier.getStatus() +
                            "\n\n" +

                            "Your account is currently pending approval.\n" +
                            "You can login after your account is approved.\n\n" +

                            "Thank you,\n" +
                            "PROCURA Team";


            emailService.sendEmail(
                    savedSupplier.getEmail(),
                    subject,
                    body
            );

        } catch (Exception e) {

            System.out.println(
                    "Supplier registered successfully, " +
                            "but email failed: " +
                            e.getMessage()
            );
        }


        return savedSupplier;
    }

    public Map<String, Object> login(SupplierLoginDto supplier) {

        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (supplier.getEmail() == null ||
                supplier.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (supplier.getPassword() == null ||
                supplier.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        String email =
                supplier.getEmail().trim().toLowerCase();


        // -----------------------------------------------------
        // FIND SUPPLIER BY EMAIL
        // -----------------------------------------------------

        Supplier existingSupplier =
                supplierRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found"
                                )
                        );


        // -----------------------------------------------------
        // CHECK ROLE
        // -----------------------------------------------------

        if (existingSupplier.getRole() != Role.SUPPLIER) {

            throw new RuntimeException(
                    "This account is not a SUPPLIER account"
            );
        }


        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        boolean passwordMatches =
                passwordEncoder.matches(
                        supplier.getPassword(),
                        existingSupplier.getPassword()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }








        // -----------------------------------------------------
        // LOGIN SUCCESS
        // -----------------------------------------------------

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "message",
                "Supplier Login Successful"
        );


        response.put(
                "supplier",
                existingSupplier
        );


        response.put(
                "role",
                existingSupplier.getRole()
        );


        return response;
    }



    // =========================================================
    // GET SUPPLIER BY ID
    // =========================================================

    public Supplier getSupplierById(Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Supplier ID is required"
            );
        }


        return supplierRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with id: "
                                        + id
                        )
                );
    }


    // =========================================================
    // GET ALL SUPPLIERS
    // =========================================================

    public List<Supplier> getAllSuppliers() {

        return supplierRepository.findAll();
    }


    // =========================================================
    // DELETE SUPPLIER
    // =========================================================

    public String deleteSupplier(Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Supplier ID is required"
            );
        }


        Supplier supplier =
                supplierRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found with id: "
                                                + id
                                )
                        );


        supplierRepository.delete(supplier);


        return "Supplier deleted successfully";
    }
    // =========================================================
// GET ALL PAYMENTS FOR A PARTICULAR SUPPLIER
// FOR TRACKING / JSON RESPONSE
// =========================================================

    public List<SupplierPaymentHistoryDto> getSupplierPaymentHistory(
            Long supplierId) {

        // =====================================================
        // 1. VALIDATE SUPPLIER ID
        // =====================================================

        if (supplierId == null || supplierId <= 0) {

            throw new RuntimeException(
                    "Invalid supplier ID: " + supplierId
            );
        }


        // =====================================================
        // 2. CHECK WHETHER SUPPLIER EXISTS
        // =====================================================

        supplierRepository
                .findById(supplierId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with id: "
                                        + supplierId
                        )
                );


        // =====================================================
        // 3. GET ALL PAYMENTS BELONGING TO THIS SUPPLIER
        // =====================================================

        List<Payment> payments =
                paymentRepository.findAllPaymentsBySupplierId(
                        supplierId
                );


        // =====================================================
        // 4. CREATE DTO LIST
        // =====================================================

        List<SupplierPaymentHistoryDto> history =
                new ArrayList<>();


        // =====================================================
        // 5. CONVERT PAYMENT ENTITY INTO DTO
        // =====================================================

        for (Payment payment : payments) {

            Long requestId = null;

            String productName = null;

            Integer quantity = null;


            // =================================================
            // 6. GET PURCHASE REQUEST
            // =================================================

            if (payment.getPurchaseRequest() != null) {

                requestId =
                        payment.getPurchaseRequest()
                                .getRequestId();


                quantity =
                        payment.getPurchaseRequest()
                                .getQuantity();


                // =============================================
                // 7. GET PRODUCT
                // =============================================

                if (payment.getPurchaseRequest().getProduct()
                        != null) {

                    productName =
                            payment.getPurchaseRequest()
                                    .getProduct()
                                    .getProductName();
                }
            }


            // =================================================
            // 8. CREATE PAYMENT HISTORY DTO
            // =================================================

            SupplierPaymentHistoryDto dto =
                    new SupplierPaymentHistoryDto(

                            payment.getPaymentId(),

                            requestId,

                            productName,

                            quantity,

                            payment.getAmount(),

                            payment.getPaymentMethod(),

                            payment.getPaymentStatus()
                    );


            // =================================================
            // 9. ADD DTO TO LIST
            // =================================================

            history.add(dto);
        }


        // =====================================================
        // 10. RETURN PAYMENT HISTORY
        // =====================================================

        return history;
    }

}







