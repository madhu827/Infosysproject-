package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.ProductResDto;
import com.example.InfosysSpringProject.Dto.ProductResponseDto;
import com.example.InfosysSpringProject.Dto.RequestDto;
import com.example.InfosysSpringProject.Dto.ResponseDto;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Product;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Enum.OrderStatus;
import com.example.InfosysSpringProject.Enum.RequestStatus;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.ProductRepository;
import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;
import com.example.InfosysSpringProject.Repository.UserRepository;
import com.example.InfosysSpringProject.Service.RequestService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/raiserequest")
public class RequestController {


    // ============================================================
    // DEPENDENCIES
    // ============================================================

    @Autowired
    private RequestService requestService;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ManagerRepository managerRepository;



    @Autowired
    private ProductRepository productRepository;


    // ============================================================
    // RAISE PURCHASE REQUEST
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ResponseDto> order(
            @RequestBody RequestDto requestDto
    ) {

        ResponseDto response =
                requestService.order(requestDto);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }


    // ============================================================
    // GET ONLY LOGGED-IN USER'S REQUESTS
    // ============================================================


    @PreAuthorize("hasAnyRole('USER', 'MANAGER')")
    @GetMapping
    public ResponseEntity<?> getMyRequests(
            Authentication authentication
    ) {

        // --------------------------------------------------------
        // CHECK AUTHENTICATION
        // --------------------------------------------------------

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User is not authenticated");
        }


        // --------------------------------------------------------
        // GET LOGGED-IN EMAIL
        // --------------------------------------------------------

        String email = authentication.getName();


        // --------------------------------------------------------
        // CHECK LOGGED-IN ROLE
        // --------------------------------------------------------

        boolean isUser =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_USER")
                        );


        boolean isManager =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_MANAGER")
                        );


        // --------------------------------------------------------
        // USER REQUESTS
        // --------------------------------------------------------

        if (isUser) {

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Logged-in user not found"
                                    )
                            );


            List<PurchaseRequest> requests =
                    purchaseRequestRepository
                            .findRequestsByUserId(
                                    user.getUser_id()
                            );


            return ResponseEntity.ok(requests);
        }


        // --------------------------------------------------------
        // MANAGER REQUESTS
        // --------------------------------------------------------

        if (isManager) {

            Manager manager =
                    managerRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Logged-in manager not found"
                                    )
                            );


            /*
             * Manager should see purchase requests
             * from his/her department.
             *
             * If your PurchaseRequest is connected to
             * Department, use the manager's department.
             */

            List<PurchaseRequest> requests =
                    purchaseRequestRepository
                            .findByDepartment(
                                    manager.getDepartment()
                            );


            return ResponseEntity.ok(requests);
        }


        // --------------------------------------------------------
        // UNKNOWN ROLE
        // --------------------------------------------------------

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Invalid user role");
    }




    // ============================================================
    // UPDATE REQUEST STATUS
    // MANAGER ONLY
    // ============================================================

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{requestId}/status")
    public ResponseEntity<String> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam RequestStatus status
    ) {

        requestService.updateRequestStatus(
                requestId,
                status
        );


        return ResponseEntity.ok(
                "Request status updated to " + status
        );
    }


    // ============================================================
    // UPDATE TRACKING
    // MANAGER / SUPPLIER
    // ============================================================

    @PreAuthorize("hasAnyRole('MANAGER','SUPPLIER')")
    @PutMapping("/tracking/{id}")
    public PurchaseRequest updateTracking(
            @PathVariable Long id,
            @RequestParam OrderStatus orderstatus,
            @RequestParam String location
    ) {

        return requestService.updateTracking(
                id,
                orderstatus,
                location
        );
    }


    // ============================================================
    // DOWNLOAD USER REQUESTS CSV
    // USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/download-csv")
    public ResponseEntity<byte[]> downloadMyRequestsCsv(
            Authentication authentication
    ) {

        // --------------------------------------------------------
        // CHECK AUTHENTICATION
        // --------------------------------------------------------

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }


        // --------------------------------------------------------
        // GET LOGGED-IN USER EMAIL
        // --------------------------------------------------------

        String email =
                authentication.getName();


        // --------------------------------------------------------
        // FIND LOGGED-IN USER
        // --------------------------------------------------------

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Logged-in user not found"
                                )
                        );


        // --------------------------------------------------------
        // GET ONLY THIS USER'S REQUESTS
        // --------------------------------------------------------

        List<PurchaseRequest> requests =
                purchaseRequestRepository
                        .findRequestsByUserId(
                                user.getUser_id()
                        );


        // --------------------------------------------------------
        // CREATE CSV
        // --------------------------------------------------------

        StringBuilder csv =
                new StringBuilder();


        // --------------------------------------------------------
        // CSV HEADER
        // --------------------------------------------------------

        csv.append(
                "Request ID,"
                        + "Product Name,"
                        + "Quantity,"
                        + "Total Price,"
                        + "Status"
        );

        csv.append("\n");


        // --------------------------------------------------------
        // CSV DATA
        // --------------------------------------------------------

        for (PurchaseRequest request : requests) {

            // ----------------------------------------------------
            // REQUEST ID
            // ----------------------------------------------------

            csv.append(
                    escapeCsv(
                            String.valueOf(
                                    request.getRequestId()
                            )
                    )
            );

            csv.append(",");


            // ----------------------------------------------------
            // PRODUCT NAME
            // ----------------------------------------------------

            String productName = "";

            if (request.getProduct() != null) {

                productName =
                        request.getProduct()
                                .getProductName();
            }

            csv.append(
                    escapeCsv(productName)
            );

            csv.append(",");


            // ----------------------------------------------------
            // QUANTITY
            // ----------------------------------------------------

            csv.append(
                    escapeCsv(
                            String.valueOf(
                                    request.getQuantity()
                            )
                    )
            );

            csv.append(",");


            // ----------------------------------------------------
            // TOTAL PRICE
            // ----------------------------------------------------

            csv.append(
                    escapeCsv(
                            String.valueOf(
                                    request.getTotalPrice()
                            )
                    )
            );

            csv.append(",");


            // ----------------------------------------------------
            // STATUS
            // ----------------------------------------------------

            String status = "";

            if (request.getStatus()!= null) {

                status =
                        request.getStatus()
                                .toString();
            }

            csv.append(
                    escapeCsv(status)
            );

            csv.append("\n");
        }


        // --------------------------------------------------------
        // CONVERT CSV TO BYTE ARRAY
        // --------------------------------------------------------

        byte[] csvBytes =
                csv.toString()
                        .getBytes(
                                StandardCharsets.UTF_8
                        );


        // --------------------------------------------------------
        // RETURN FILE
        // --------------------------------------------------------

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=procurex-my-requests.csv"
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        "text/csv; charset=UTF-8"
                )
                .body(csvBytes);
    }


    // ============================================================
    // CSV ESCAPE METHOD
    // ============================================================

    private String escapeCsv(String value) {

        if (value == null) {
            return "";
        }


        return "\""
                + value.replace(
                "\"",
                "\"\""
        )
                + "\"";
    }
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{requestId}/product")
    public ResponseEntity<ProductResDto> getProductByRequestId(
            @PathVariable Long requestId) {

        // ---------------------------------------------------------
        // 1. FIND PURCHASE REQUEST USING REQUEST ID
        // ---------------------------------------------------------

        PurchaseRequest request =
                purchaseRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase request not found with ID: "
                                                + requestId
                                )
                        );


        // ---------------------------------------------------------
        // 2. GET PRODUCT ID FROM PURCHASE REQUEST
        // ---------------------------------------------------------

        Long productId = request.getProduct().getProductId();

        if (productId == null) {

            throw new RuntimeException(
                    "Product ID is not available for request: "
                            + requestId
            );
        }


        // ---------------------------------------------------------
        // 3. FIND PRODUCT USING PRODUCT ID
        // ---------------------------------------------------------

        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with ID: "
                                                + productId
                                )
                        );


        // ---------------------------------------------------------
        // 4. CONVERT PRODUCT → PRODUCT RESPONSE DTO
        // ---------------------------------------------------------

        ProductResDto responseDto =
                new ProductResDto();

        responseDto.setProductName(
                product.getProductName()
        );

        responseDto.setProduct_price(
                product.getProduct_price()
        );



        responseDto.setDescription(
                product.getDescription()
        );

        responseDto.setImageUrl(
                product.getImageUrl()
        );


        // ---------------------------------------------------------
        // 5. RETURN DTO
        // ---------------------------------------------------------

        return ResponseEntity.ok(responseDto);
    }
}
