package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.SupplierPaymentHistoryDto;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Payment;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.PaymentRepository;
import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;
import com.example.InfosysSpringProject.Repository.SupplierRepository;
import com.example.InfosysSpringProject.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvService {

    // =====================================================
    // CSV FILE LOCATIONS
    // =====================================================

    private static final String DATA_FOLDER = "data";

    private static final String USER_FILE =
            DATA_FOLDER + "/users.csv";

    private static final String MANAGER_FILE =
            DATA_FOLDER + "/managers.csv";


    // =====================================================
    // REPOSITORIES
    // =====================================================

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;


    // =====================================================
    // CSV HEADERS
    // =====================================================

    private static final String USER_HEADER =
            "UserId,UserName,Email,PhoneNo,Designation,Department";

    private static final String MANAGER_HEADER =
            "ManagerId,ManagerName,Email,PhoneNo,Designation,Department";

    private static final String PAYMENT_HEADER =
            "PaymentId,UserName,UserEmail,ProductName,Quantity,ProductPrice,TotalPrice,Amount,PaymentStatus";


    // =====================================================
    // CREATE DATA DIRECTORY
    // =====================================================

    private static void createDataDirectory()
            throws IOException {

        Path path = Paths.get(DATA_FOLDER);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }


    // =====================================================
    // CSV VALUE ESCAPING
    // =====================================================

    private static String csvValue(Object value) {

        if (value == null) {
            return "";
        }

        String text = String.valueOf(value);

        if (
                text.contains(",")
                        || text.contains("\"")
                        || text.contains("\n")
                        || text.contains("\r")
        ) {

            text = text.replace(
                    "\"",
                    "\"\""
            );

            return "\"" + text + "\"";
        }

        return text;
    }


    // =====================================================
    // USER CSV
    // =====================================================

    public byte[] downloadUserCsv(Long userId)
            throws IOException {

        // =================================================
        // 1. VALIDATE USER ID
        // =================================================

        if (userId == null || userId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid user ID: " + userId
            );
        }


        // =================================================
        // 2. GET USER FROM DATABASE
        // =================================================

        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found with ID: "
                                                + userId
                                )
                        );


        // =================================================
        // 3. GET USER REQUESTS FROM DATABASE
        // =================================================

        List<PurchaseRequest> requests =
                purchaseRequestRepository
                        .findRequestsByUserId(userId);

        if (requests == null) {
            requests = new ArrayList<>();
        }


        // =================================================
        // 4. DEBUG
        // =================================================

        System.out.println(
                "=============================================="
        );

        System.out.println(
                "GENERATING USER CSV"
        );

        System.out.println(
                "USER ID: " + userId
        );

        System.out.println(
                "REQUEST COUNT: "
                        + requests.size()
        );

        System.out.println(
                "=============================================="
        );


        // =================================================
        // 5. USER DETAILS
        // =================================================

        String userIdValue = "";

        if (user.getUser_id() != null) {

            userIdValue =
                    String.valueOf(
                            user.getUser_id()
                    );
        }


        String userName = "";

        if (user.getUserName() != null) {

            userName =
                    user.getUserName();
        }


        String email = "";

        if (user.getEmail() != null) {

            email =
                    user.getEmail();
        }


        String phone = "";

        if (user.getUser_phoneno() != null) {

            phone =
                    String.valueOf(
                            user.getUser_phoneno()
                    );
        }


        String designation = "";

        if (user.getDesignation() != null) {

            designation =
                    user.getDesignation();
        }


        // =================================================
        // 6. DEPARTMENT
        // =================================================

        String departmentName = "";

        if (
                user.getDepartment() != null
                        && user.getDepartment()
                        .getDepartmentName() != null
        ) {

            departmentName =
                    user.getDepartment()
                            .getDepartmentName();
        }


        // =================================================
        // 7. CREATE DIRECTORY
        // =================================================

        createDataDirectory();


        // =================================================
        // 8. FILE PATH
        // =================================================

        String filePath =
                DATA_FOLDER
                        + "/user_"
                        + userId
                        + ".csv";


        // =================================================
        // 9. CREATE CSV
        // =================================================

        StringBuilder csv =
                new StringBuilder();


        // =================================================
        // 10. HEADER
        // =================================================

        csv.append(
                "User ID,"
                        + "User Name,"
                        + "Email,"
                        + "Phone,"
                        + "Designation,"
                        + "Department,"
                        + "Request ID,"
                        + "Quantity,"
                        + "Request Status"
        );

        csv.append(
                System.lineSeparator()
        );


        // =================================================
        // 11. NO REQUESTS
        // =================================================

        if (requests.isEmpty()) {

            csv.append(
                    csvValue(userIdValue)
            ).append(",");

            csv.append(
                    csvValue(userName)
            ).append(",");

            csv.append(
                    csvValue(email)
            ).append(",");

            csv.append(
                    csvValue(phone)
            ).append(",");

            csv.append(
                    csvValue(designation)
            ).append(",");

            csv.append(
                    csvValue(departmentName)
            ).append(",");

            csv.append(",,,");

            csv.append(
                    System.lineSeparator()
            );
        }


        // =================================================
        // 12. REQUESTS EXIST
        // =================================================

        else {

            for (PurchaseRequest request : requests) {

                String requestId = "";

                if (request.getRequestId() != null) {

                    requestId =
                            String.valueOf(
                                    request.getRequestId()
                            );
                }


                String quantity = "";

                if (request.getQuantity() != null) {

                    quantity =
                            String.valueOf(
                                    request.getQuantity()
                            );
                }


                String requestStatus = "";

                if (request.getStatus() != null) {

                    requestStatus =
                            String.valueOf(
                                    request.getStatus()
                            );
                }


                csv.append(
                        csvValue(userIdValue)
                ).append(",");

                csv.append(
                        csvValue(userName)
                ).append(",");

                csv.append(
                        csvValue(email)
                ).append(",");

                csv.append(
                        csvValue(phone)
                ).append(",");

                csv.append(
                        csvValue(designation)
                ).append(",");

                csv.append(
                        csvValue(departmentName)
                ).append(",");

                csv.append(
                        csvValue(requestId)
                ).append(",");

                csv.append(
                        csvValue(quantity)
                ).append(",");

                csv.append(
                        csvValue(requestStatus)
                );

                csv.append(
                        System.lineSeparator()
                );
            }
        }


        // =================================================
        // 13. SAVE CSV
        // =================================================

        Files.write(
                Paths.get(filePath),
                csv.toString()
                        .getBytes(
                                StandardCharsets.UTF_8
                        )
        );


        // =================================================
        // 14. RETURN CSV
        // =================================================

        return Files.readAllBytes(
                Paths.get(filePath)
        );
    }


    // =====================================================
    // MANAGER CSV
    // =====================================================

    public byte[] downloadManagerCsv(Long managerId)
            throws IOException {

        // =================================================
        // 1. VALIDATE MANAGER ID
        // =================================================

        if (managerId == null || managerId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid manager ID: " + managerId
            );
        }


        // =================================================
        // 2. GET MANAGER FROM DATABASE
        // =================================================

        Manager manager =
                managerRepository
                        .findByManagerId(managerId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Manager not found with ID: "
                                                + managerId
                                )
                        );


        // =================================================
        // 3. GET DEPARTMENT FROM DATABASE
        // =================================================

        String departmentName = "";

        if (
                manager.getDepartment() != null
                        && manager.getDepartment()
                        .getDepartmentName() != null
        ) {

            departmentName =
                    manager.getDepartment()
                            .getDepartmentName();
        }


        // =================================================
        // 4. GET REQUESTS FROM DATABASE
        // =================================================

        List<PurchaseRequest> requests =
                purchaseRequestRepository
                        .findRequestsByDepartment_DepartmentName(
                                departmentName
                        );

        if (requests == null) {

            requests =
                    new ArrayList<>();
        }


        // =================================================
        // 5. DEBUG
        // =================================================

        System.out.println(
                "=============================================="
        );

        System.out.println(
                "GENERATING MANAGER CSV"
        );

        System.out.println(
                "MANAGER ID: " + managerId
        );

        System.out.println(
                "MANAGER NAME: "
                        + manager.getManagerName()
        );

        System.out.println(
                "DEPARTMENT: "
                        + departmentName
        );

        System.out.println(
                "REQUEST COUNT: "
                        + requests.size()
        );

        System.out.println(
                "=============================================="
        );


        // =================================================
        // 6. CREATE CSV
        // =================================================

        StringBuilder csv =
                new StringBuilder();


        // =================================================
        // 7. HEADER
        // =================================================

        csv.append(
                "Manager ID,"
                        + "Manager Name,"
                        + "Email,"
                        + "Department,"
                        + "Request ID,"
                        + "Quantity,"
                        + "Total Amount,"
                        + "Request Status,"
                        + "Order Status"
        );

        csv.append(
                System.lineSeparator()
        );


        // =================================================
        // 8. NO REQUESTS
        // =================================================

        if (requests.isEmpty()) {

            csv.append(
                    csvValue(
                            manager.getManagerId()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            manager.getManagerName()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            manager.getEmail()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            departmentName
                    )
            ).append(",");

            // Request ID
            csv.append(",");

            // Quantity
            csv.append(",");

            // Total Amount
            csv.append(",");

            // Request Status
            csv.append(",");

            // Order Status
            csv.append(
                    System.lineSeparator()
            );
        }


        // =================================================
        // 9. REQUESTS EXIST
        // =================================================

        else {

            for (PurchaseRequest request : requests) {

                // =========================================
                // REQUEST ID
                // =========================================

                String requestId = "";

                if (request.getRequestId() != null) {

                    requestId =
                            String.valueOf(
                                    request.getRequestId()
                            );
                }


                // =========================================
                // QUANTITY
                // =========================================

                String quantity = "";

                if (request.getQuantity() != null) {

                    quantity =
                            String.valueOf(
                                    request.getQuantity()
                            );
                }


                // =========================================
                // TOTAL AMOUNT
                // =========================================

                String totalAmount = "";


                /*
                 * STEP 1:
                 *
                 * Try to get the amount from Payment.
                 *
                 * If the request is paid and has a payment,
                 * this amount will be used.
                 */

                Payment payment =
                        paymentRepository
                                .findByPurchaseRequest_RequestId(
                                        request.getRequestId()
                                );


                if (
                        payment != null
                                && payment.getAmount() != null
                ) {

                    totalAmount =
                            String.valueOf(
                                    payment.getAmount()
                            );
                }


                /*
                 * STEP 2:
                 *
                 * If there is NO payment amount,
                 * calculate:
                 *
                 * Product Price × Quantity
                 *
                 * This handles REJECTED requests too.
                 */

                if (
                        totalAmount.isEmpty()
                                && request.getProduct() != null
                                && request.getQuantity() != null
                                && request.getProduct()
                                .getProduct_price() != null
                ) {

                    try {

                        BigDecimal productPrice =
                                new BigDecimal(
                                        String.valueOf(
                                                request.getProduct()
                                                        .getProduct_price()
                                        )
                                );


                        BigDecimal requestQuantity =
                                new BigDecimal(
                                        String.valueOf(
                                                request.getQuantity()
                                        )
                                );


                        BigDecimal calculatedAmount =
                                productPrice.multiply(
                                        requestQuantity
                                );


                        totalAmount =
                                calculatedAmount
                                        .stripTrailingZeros()
                                        .toPlainString();


                    } catch (Exception e) {

                        System.out.println(
                                "Unable to calculate total amount "
                                        + "for Request ID: "
                                        + request.getRequestId()
                        );
                    }
                }


                // =========================================
                // REQUEST STATUS
                // =========================================

                String requestStatus = "";

                if (request.getStatus() != null) {

                    requestStatus =
                            String.valueOf(
                                    request.getStatus()
                            );
                }


                // =========================================
                // ORDER STATUS
                // =========================================

                String orderStatus = "";

                if (request.getOrderStatus() != null) {

                    orderStatus =
                            String.valueOf(
                                    request.getOrderStatus()
                            );
                }


                // =========================================
                // DEBUG
                // =========================================

                System.out.println(
                        "----------------------------------------------"
                );

                System.out.println(
                        "Request ID     : "
                                + requestId
                );

                System.out.println(
                        "Quantity       : "
                                + quantity
                );

                System.out.println(
                        "Total Amount   : "
                                + totalAmount
                );

                System.out.println(
                        "Request Status : "
                                + requestStatus
                );

                System.out.println(
                        "Order Status   : "
                                + orderStatus
                );


                // =========================================
                // WRITE CSV ROW
                // =========================================

                csv.append(
                        csvValue(
                                manager.getManagerId()
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                manager.getManagerName()
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                manager.getEmail()
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                departmentName
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                requestId
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                quantity
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                totalAmount
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                requestStatus
                        )
                ).append(",");

                csv.append(
                        csvValue(
                                orderStatus
                        )
                );

                csv.append(
                        System.lineSeparator()
                );
            }
        }


        // =================================================
        // 10. RETURN CSV
        // =================================================

        return csv.toString()
                .getBytes(
                        StandardCharsets.UTF_8
                );
    }


    // =====================================================
    // MANAGER PAYMENT CSV
    // =====================================================

    public byte[] generatePaymentCsvByManagerId(
            Long managerId
    ) {

        // =================================================
        // 1. VALIDATE MANAGER ID
        // =================================================

        if (managerId == null || managerId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid manager ID: " + managerId
            );
        }


        // =================================================
        // 2. CHECK MANAGER EXISTS
        // =================================================

        Manager manager =
                managerRepository
                        .findByManagerId(managerId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Manager not found with ID: "
                                                + managerId
                                )
                        );


        // =================================================
        // 3. GET PAYMENTS FROM DATABASE
        // =================================================

        List<Payment> payments =
                paymentRepository
                        .findByManager_ManagerId(
                                managerId
                        );

        if (payments == null) {

            payments =
                    new ArrayList<>();
        }


        // =================================================
        // 4. DEBUG
        // =================================================

        System.out.println(
                "=============================================="
        );

        System.out.println(
                "GENERATING MANAGER PAYMENT CSV"
        );

        System.out.println(
                "MANAGER ID: "
                        + managerId
        );

        System.out.println(
                "MANAGER NAME: "
                        + manager.getManagerName()
        );

        System.out.println(
                "TOTAL PAYMENTS: "
                        + payments.size()
        );

        System.out.println(
                "=============================================="
        );


        // =================================================
        // 5. CREATE CSV
        // =================================================

        StringBuilder csv =
                new StringBuilder();


        // =================================================
        // 6. HEADER
        // =================================================

        csv.append(
                "Manager ID,"
                        + "Payment ID,"
                        + "Amount,"
                        + "Payment Status,"
                        + "Request ID,"
                        + "Payment Method"
        );

        csv.append(
                System.lineSeparator()
        );


        // =================================================
        // 7. WRITE PAYMENT DATA
        // =================================================

        for (Payment payment : payments) {

            // =============================================
            // MANAGER ID
            // =============================================

            String paymentManagerId = "";

            if (
                    payment.getManager() != null
                            && payment.getManager()
                            .getManagerId() != null
            ) {

                paymentManagerId =
                        String.valueOf(
                                payment.getManager()
                                        .getManagerId()
                        );
            }


            // =============================================
            // PAYMENT ID
            // =============================================

            String paymentId = "";

            if (payment.getPaymentId() != null) {

                paymentId =
                        String.valueOf(
                                payment.getPaymentId()
                        );
            }


            // =============================================
            // AMOUNT
            // =============================================

            String amount = "";

            if (payment.getAmount() != null) {

                amount =
                        String.valueOf(
                                payment.getAmount()
                        );
            }


            // =============================================
            // PAYMENT STATUS
            // =============================================

            String paymentStatus = "";

            if (payment.getPaymentStatus() != null) {

                paymentStatus =
                        String.valueOf(
                                payment.getPaymentStatus()
                        );
            }


            // =============================================
            // REQUEST ID
            // =============================================

            String requestId = "";

            if (
                    payment.getPurchaseRequest() != null
                            && payment.getPurchaseRequest()
                            .getRequestId() != null
            ) {

                requestId =
                        String.valueOf(
                                payment.getPurchaseRequest()
                                        .getRequestId()
                        );
            }


            // =============================================
            // PAYMENT METHOD
            // =============================================

            String paymentMethod = "";

            if (payment.getPaymentMethod() != null) {

                paymentMethod =
                        String.valueOf(
                                payment.getPaymentMethod()
                        );
            }


            // =============================================
            // WRITE ROW
            // =============================================

            csv.append(
                    csvValue(
                            paymentManagerId
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            paymentId
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            amount
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            paymentStatus
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            requestId
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            paymentMethod
                    )
            );

            csv.append(
                    System.lineSeparator()
            );
        }


        // =================================================
        // 8. RETURN CSV
        // =================================================

        return csv.toString()
                .getBytes(
                        StandardCharsets.UTF_8
                );
    }


    // =====================================================
    // SUPPLIER PAYMENT CSV
    // =====================================================

    public byte[] getPaymentsBySupplierId(
            Long supplierId
    ) {

        // =================================================
        // 1. VALIDATE SUPPLIER ID
        // =================================================

        if (
                supplierId == null
                        || supplierId <= 0
        ) {

            throw new RuntimeException(
                    "Invalid supplier ID: "
                            + supplierId
            );
        }


        // =================================================
        // 2. GET PAYMENTS FROM DATABASE
        // =================================================

        List<Payment> payments =
                paymentRepository
                        .findAllPaymentsBySupplierId(
                                supplierId
                        );

        if (payments == null) {

            payments =
                    new ArrayList<>();
        }


        // =================================================
        // 3. DEBUG
        // =================================================

        System.out.println(
                "=============================================="
        );

        System.out.println(
                "GENERATING SUPPLIER PAYMENT CSV"
        );

        System.out.println(
                "SUPPLIER ID: "
                        + supplierId
        );

        System.out.println(
                "TOTAL PAYMENTS: "
                        + payments.size()
        );

        System.out.println(
                "=============================================="
        );


        // =================================================
        // 4. CREATE CSV
        // =================================================

        StringBuilder csv =
                new StringBuilder();


        // =================================================
        // 5. HEADER
        // =================================================

        csv.append(
                "payment_id,"
                        + "request_id,"
                        + "product_name,"
                        + "quantity,"
                        + "amount,"
                        + "payment_method,"
                        + "payment_status"
        );

        csv.append(
                System.lineSeparator()
        );


        // =================================================
        // 6. WRITE PAYMENT DATA
        // =================================================

        for (Payment payment : payments) {

            String requestId = "";

            String productName = "";

            String quantity = "";


            // =============================================
            // PURCHASE REQUEST
            // =============================================

            if (
                    payment.getPurchaseRequest() != null
            ) {

                if (
                        payment.getPurchaseRequest()
                                .getRequestId() != null
                ) {

                    requestId =
                            String.valueOf(
                                    payment.getPurchaseRequest()
                                            .getRequestId()
                            );
                }


                // =========================================
                // PRODUCT
                // =========================================

                if (
                        payment.getPurchaseRequest()
                                .getProduct() != null
                ) {

                    if (
                            payment.getPurchaseRequest()
                                    .getProduct()
                                    .getProductName() != null
                    ) {

                        productName =
                                payment.getPurchaseRequest()
                                        .getProduct()
                                        .getProductName();
                    }
                }


                // =========================================
                // QUANTITY
                // =========================================

                if (
                        payment.getPurchaseRequest()
                                .getQuantity() != null
                ) {

                    quantity =
                            String.valueOf(
                                    payment.getPurchaseRequest()
                                            .getQuantity()
                            );
                }
            }


            // =============================================
            // WRITE ROW
            // =============================================

            csv.append(
                    csvValue(
                            payment.getPaymentId()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            requestId
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            productName
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            quantity
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            payment.getAmount()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            payment.getPaymentMethod()
                    )
            ).append(",");

            csv.append(
                    csvValue(
                            payment.getPaymentStatus()
                    )
            );

            csv.append(
                    System.lineSeparator()
            );
        }


        // =================================================
        // 7. RETURN CSV
        // =================================================

        return csv.toString()
                .getBytes(
                        StandardCharsets.UTF_8
                );
    }


    // =====================================================
    // SUPPLIER PAYMENT HISTORY
    // =====================================================

    public List<SupplierPaymentHistoryDto>
    getSupplierPaymentHistory(
            Long supplierId
    ) {

        // =================================================
        // 1. VALIDATE SUPPLIER ID
        // =================================================

        if (
                supplierId == null
                        || supplierId <= 0
        ) {

            throw new RuntimeException(
                    "Invalid supplier ID: "
                            + supplierId
            );
        }


        // =================================================
        // 2. CHECK SUPPLIER EXISTS
        // =================================================

        supplierRepository.findById(supplierId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Supplier not found with ID: "
                                        + supplierId
                        )
                );


        // =================================================
        // 3. GET PAYMENTS FROM DATABASE
        // =================================================

        List<Payment> payments =
                paymentRepository
                        .findPaymentsBySupplierId(
                                supplierId
                        );

        if (payments == null) {

            payments =
                    new ArrayList<>();
        }


        // =================================================
        // 4. DEBUG
        // =================================================

        System.out.println(
                "Supplier ID: "
                        + supplierId
        );

        System.out.println(
                "Total payments found: "
                        + payments.size()
        );


        // =================================================
        // 5. CREATE DTO LIST
        // =================================================

        List<SupplierPaymentHistoryDto> history =
                new ArrayList<>();


        // =================================================
        // 6. CONVERT PAYMENT → DTO
        // =================================================

        for (Payment payment : payments) {

            SupplierPaymentHistoryDto dto =
                    new SupplierPaymentHistoryDto();


            // =============================================
            // PAYMENT INFORMATION
            // =============================================

            dto.setPaymentId(
                    payment.getPaymentId()
            );

            dto.setAmount(
                    payment.getAmount()
            );

            dto.setPaymentMethod(
                    payment.getPaymentMethod()
            );

            dto.setPaymentStatus(
                    payment.getPaymentStatus()
            );


            // =============================================
            // PURCHASE REQUEST
            // =============================================

            if (
                    payment.getPurchaseRequest() != null
            ) {

                dto.setRequestId(
                        payment.getPurchaseRequest()
                                .getRequestId()
                );

                dto.setQuantity(
                        payment.getPurchaseRequest()
                                .getQuantity()
                );


                // =========================================
                // PRODUCT
                // =========================================

                if (
                        payment.getPurchaseRequest()
                                .getProduct() != null
                ) {

                    dto.setProductName(
                            payment.getPurchaseRequest()
                                    .getProduct()
                                    .getProductName()
                    );
                }
            }


            // =============================================
            // ADD DTO
            // =============================================

            history.add(dto);
        }


        // =================================================
        // 7. DEBUG
        // =================================================

        System.out.println(
                "Total DTO records returned: "
                        + history.size()
        );


        // =================================================
        // 8. RETURN
        // =================================================

        return history;
    }
}