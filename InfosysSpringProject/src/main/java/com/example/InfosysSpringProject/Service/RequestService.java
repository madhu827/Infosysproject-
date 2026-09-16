package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.RequestDto;
import com.example.InfosysSpringProject.Dto.ResponseDto;
import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Product;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Entity.Supplier;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Enum.OrderStatus;
import com.example.InfosysSpringProject.Enum.RequestStatus;
import com.example.InfosysSpringProject.Repository.DepartmentRepository;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.ProductRepository;
import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;
import com.example.InfosysSpringProject.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RequestService {

    // =========================================================
    // REPOSITORIES
    // =========================================================

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private EmailService emailService;


    // =========================================================
    // CREATE PRODUCT REQUEST
    // =========================================================
    public ResponseDto order(RequestDto requestDto) {

        // -----------------------------------------------------
        // VALIDATE REQUEST DATA
        // -----------------------------------------------------

        if (requestDto.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        if (requestDto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (requestDto.getQuantity() == null ||
                requestDto.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }


        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user = userRepository
                .findById(requestDto.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // -----------------------------------------------------
        // GET DEPARTMENT FROM USER
        // -----------------------------------------------------

        Department department = user.getDepartment();

        if (department == null) {

            throw new RuntimeException(
                    "Department is not assigned to this user"
            );
        }


        // -----------------------------------------------------
        // FIND PRODUCT USING PRODUCT ID
        // -----------------------------------------------------

        Product product = productRepository
                .findById(requestDto.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );


        // -----------------------------------------------------
        // CHECK STOCK
        // -----------------------------------------------------

        if (requestDto.getQuantity()
                > product.getProductQuantity()) {

            throw new RuntimeException(
                    "Available quantity is "
                            + product.getProductQuantity()
                            + " but you are trying to request "
                            + requestDto.getQuantity()
                            + " products"
            );
        }


        // -----------------------------------------------------
        // CALCULATE TOTAL PRICE
        // -----------------------------------------------------

        double totalPrice =
                product.getProduct_price()
                        * requestDto.getQuantity();


        // -----------------------------------------------------
        // REDUCE PRODUCT STOCK
        // -----------------------------------------------------

        product.setProductQuantity(
                product.getProductQuantity()
                        - requestDto.getQuantity()
        );

        productRepository.save(product);


        // =====================================================
        // CREATE PURCHASE REQUEST
        // =====================================================

        PurchaseRequest purchaseRequest =
                new PurchaseRequest();

        purchaseRequest.setUser(user);

        purchaseRequest.setProduct(product);

        purchaseRequest.setDepartment(department);

        purchaseRequest.setQuantity(
                requestDto.getQuantity()
        );

        purchaseRequest.setStatus(
                RequestStatus.PENDING
        );

        purchaseRequest.setTotalPrice(
                totalPrice
        );


        // -----------------------------------------------------
        // SAVE REQUEST
        // -----------------------------------------------------

        PurchaseRequest savedRequest =
                purchaseRequestRepository
                        .save(purchaseRequest);


        // =====================================================
        // SEND EMAIL TO USER
        // =====================================================

        String userSubject =
                "Product Request Submitted Successfully";

        String userBody =
                "Hello "
                        + user.getUserName()
                        + ",\n\n"

                        + "Your product request has been "
                        + "submitted successfully.\n\n"

                        + "================================\n"
                        + "REQUEST DETAILS\n"
                        + "================================\n"

                        + "Request ID : "
                        + savedRequest.getRequestId()
                        + "\n"

                        + "Product Name : "
                        + product.getProductName()
                        + "\n"

                        + "Quantity : "
                        + requestDto.getQuantity()
                        + "\n"

                        + "Product Price : "
                        + product.getProduct_price()
                        + "\n"

                        + "Total Price : "
                        + totalPrice
                        + "\n"

                        + "Department : "
                        + department.getDepartmentName()
                        + "\n"

                        + "Status : PENDING\n"

                        + "================================\n\n"

                        + "Your request is waiting "
                        + "for manager approval.\n\n"

                        + "Thank you.";


        if (user.getEmail() != null &&
                !user.getEmail().isBlank()) {

            emailService.sendEmail(
                    user.getEmail(),
                    userSubject,
                    userBody
            );
        }


        // =====================================================
        // SEND EMAIL TO MANAGERS
        // =====================================================

        List<Manager> managers =
                managerRepository.findAll();

        if (!managers.isEmpty()) {

            for (Manager manager : managers) {

                if (manager.getEmail() == null ||
                        manager.getEmail().isBlank()) {

                    continue;
                }


                String managerSubject =
                        "New Product Request Pending Verification";


                String managerBody =
                        "Dear Manager,\n\n"

                                + "A new product request has "
                                + "been raised.\n\n"

                                + "================================\n"
                                + "REQUEST DETAILS\n"
                                + "================================\n"

                                + "Request ID : "
                                + savedRequest.getRequestId()
                                + "\n"

                                + "User : "
                                + user.getUserName()
                                + "\n"

                                + "Product : "
                                + product.getProductName()
                                + "\n"

                                + "Quantity : "
                                + requestDto.getQuantity()
                                + "\n"

                                + "Total Price : "
                                + totalPrice
                                + "\n"

                                + "Department : "
                                + department.getDepartmentName()
                                + "\n"

                                + "Status : PENDING\n"

                                + "================================\n\n"

                                + "Please verify the request "
                                + "in the system.";


                emailService.sendEmail(
                        manager.getEmail(),
                        managerSubject,
                        managerBody
                );
            }
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        ResponseDto response =
                new ResponseDto();

        response.setUserId(
                user.getUser_id()
        );

        response.setDepartmentId(
                department.getDepartmentId()
        );

        response.setProductName(
                product.getProductName()
        );

        response.setQuantity(
                requestDto.getQuantity()
        );

        response.setRequestId(
                savedRequest.getRequestId()
        );

        response.setProductPrice(
                product.getProduct_price()
        );

        response.setTotalPrice(
                totalPrice
        );


        return response;
    }



    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    public List<ResponseDto> getallrequests() {

        List<PurchaseRequest> requests =
                purchaseRequestRepository.findAll();

        List<ResponseDto> response =
                new ArrayList<>();


        for (PurchaseRequest request : requests) {

            ResponseDto dto =
                    new ResponseDto();


            dto.setRequestId(
                    request.getRequestId()
            );


            if (request.getUser() != null) {

                dto.setUserId(
                        request.getUser().getUser_id()
                );
            }


            if (request.getDepartment() != null) {

                dto.setDepartmentId(
                        request.getDepartment()
                                .getDepartmentId()
                );
            }


            if (request.getProduct() != null) {

                dto.setProductName(
                        request.getProduct()
                                .getProductName()
                );

                dto.setProductPrice(
                        request.getProduct()
                                .getProduct_price()
                );
            }


            dto.setQuantity(
                    request.getQuantity()
            );

            dto.setTotalPrice(
                    request.getTotalPrice()
            );


            response.add(dto);
        }


        return response;
    }


    // =========================================================
    // UPDATE REQUEST STATUS
    // =========================================================

    public void updateRequestStatus(
            Long requestId,
            RequestStatus status) {


        // -----------------------------------------------------
        // FIND REQUEST
        // -----------------------------------------------------

        PurchaseRequest request =
                purchaseRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"
                                )
                        );


        // -----------------------------------------------------
        // UPDATE STATUS
        // -----------------------------------------------------

        request.setStatus(status);


        PurchaseRequest savedRequest =
                purchaseRequestRepository
                        .save(request);


        // -----------------------------------------------------
        // CHECK USER
        // -----------------------------------------------------

        if (savedRequest.getUser() == null ||
                savedRequest.getUser().getEmail() == null ||
                savedRequest.getUser().getEmail().isBlank()) {

            return;
        }


        // =====================================================
        // SEND EMAIL TO USER
        // =====================================================

        String subject =
                "Product Request " + status;


        String body =
                "Dear "
                        + savedRequest.getUser().getUserName()
                        + ",\n\n"

                        + "We would like to inform you that "
                        + "your product request has been "
                        + status
                        + " by the manager.\n\n"

                        + "================================\n"
                        + "REQUEST DETAILS\n"
                        + "================================\n"

                        + "Request ID : "
                        + savedRequest.getRequestId()
                        + "\n"

                        + "Product Name : "
                        + savedRequest.getProduct()
                        .getProductName()
                        + "\n"

                        + "Quantity : "
                        + savedRequest.getQuantity()
                        + "\n"

                        + "Current Status : "
                        + status
                        + "\n"

                        + "================================\n\n"

                        + "If you have any questions regarding "
                        + "this request, please contact the "
                        + "support team.\n\n"

                        + "Regards,\n"
                        + "InfosysSpringProject Team";


        emailService.sendEmail(
                savedRequest.getUser().getEmail(),
                subject,
                body
        );
    }


    // =========================================================
    // UPDATE ORDER TRACKING
    // =========================================================

    public PurchaseRequest updateTracking(
            Long requestId,
            OrderStatus status,
            String location) {


        // -----------------------------------------------------
        // FIND PURCHASE REQUEST
        // -----------------------------------------------------

        PurchaseRequest request =
                purchaseRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"
                                )
                        );


        // -----------------------------------------------------
        // CHECK PRODUCT
        // -----------------------------------------------------

        if (request.getProduct() == null) {

            throw new RuntimeException(
                    "Product not associated with this request"
            );
        }


        // -----------------------------------------------------
        // UPDATE TRACKING STATUS
        // -----------------------------------------------------

        request.setOrderStatus(status);

        request.setCurrentLocation(location);


        // -----------------------------------------------------
        // DISPATCHED
        // -----------------------------------------------------

        if (status == OrderStatus.DISPATCHED) {

            request.setDispatchedDate(
                    LocalDate.now()
            );

            request.setExpectedDeliveryDate(
                    LocalDate.now().plusDays(3)
            );
        }


        // -----------------------------------------------------
        // IN TRANSIT
        // -----------------------------------------------------

        if (status == OrderStatus.IN_TRANSIT) {

            if (request.getExpectedDeliveryDate()
                    == null) {

                request.setExpectedDeliveryDate(
                        LocalDate.now().plusDays(3)
                );
            }
        }


        // -----------------------------------------------------
        // DELIVERED
        // -----------------------------------------------------

        if (status == OrderStatus.DELIVERED) {

            request.setDeliveredDate(
                    LocalDate.now()
            );
        }


        // -----------------------------------------------------
        // SAVE REQUEST
        // -----------------------------------------------------

        PurchaseRequest savedRequest =
                purchaseRequestRepository
                        .save(request);


        // =====================================================
        // PRODUCT
        // =====================================================

        Product product =
                savedRequest.getProduct();


        String productName =
                product.getProductName();


        // =====================================================
        // EMAIL DETAILS
        // =====================================================

        String subject =
                "Order Tracking Update - "
                        + productName;


        String body =
                "Hello,\n\n"

                        + "Your order tracking has been "
                        + "updated.\n\n"

                        + "================================\n"
                        + "ORDER TRACKING DETAILS\n"
                        + "================================\n"

                        + "Order ID : "
                        + savedRequest.getRequestId()
                        + "\n"

                        + "Product Name : "
                        + productName
                        + "\n"

                        + "Current Status : "
                        + status
                        + "\n"

                        + "Current Location : "
                        + location
                        + "\n"

                        + "Dispatched Date : "
                        + savedRequest.getDispatchedDate()
                        + "\n"

                        + "Expected Delivery Date : "
                        + savedRequest
                        .getExpectedDeliveryDate()
                        + "\n"

                        + "Delivered Date : "
                        + savedRequest
                        .getDeliveredDate()
                        + "\n"

                        + "================================\n\n"

                        + "Thank you for using "
                        + "InfosysSpringProject.";


        // =====================================================
        // SEND EMAIL TO USER
        // =====================================================

        if (savedRequest.getUser() != null &&
                savedRequest.getUser().getEmail() != null &&
                !savedRequest.getUser().getEmail().isBlank()) {

            emailService.sendEmail(
                    savedRequest.getUser().getEmail(),
                    subject,
                    body
            );
        }


        // =====================================================
        // SEND EMAIL TO MANAGERS
        // =====================================================

        List<Manager> managers =
                managerRepository.findAll();


        for (Manager manager : managers) {

            if (manager.getEmail() != null &&
                    !manager.getEmail().isBlank()) {

                emailService.sendEmail(
                        manager.getEmail(),
                        subject,
                        body
                );
            }
        }


        // =====================================================
        // SEND EMAIL TO SUPPLIER
        // =====================================================

        /*
         * Product has:
         *
         * @ManyToOne
         * @JoinColumn(name = "supplier_id")
         * private Supplier supplier;
         *
         * Therefore we directly get the supplier
         * from the product.
         */

        Supplier supplier =
                product.getSupplier();


        if (supplier != null &&
                supplier.getEmail() != null &&
                !supplier.getEmail().isBlank()) {

            emailService.sendEmail(
                    supplier.getEmail(),
                    subject,
                    body
            );
        }


        return savedRequest;
    }
}

