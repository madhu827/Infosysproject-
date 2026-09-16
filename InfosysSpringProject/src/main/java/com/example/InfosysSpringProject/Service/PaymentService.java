
        package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.PaymentResponseDto;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Payment;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Enum.PaymentStatus;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.PaymentRepository;
import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

        @Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    private final EmailService emailService;


    /* ============================================================
       CONSTRUCTOR
    ============================================================ */

    public PaymentService(
            PaymentRepository paymentRepository,
            PurchaseRequestRepository purchaseRequestRepository,
            EmailService emailService) {

        this.paymentRepository = paymentRepository;
        this.purchaseRequestRepository = purchaseRequestRepository;
        this.emailService = emailService;
    }
    @Autowired
    private ManagerRepository managerRepository;


    /* ============================================================
       CREATE PAYMENT

       Called when Manager clicks:

       "Payment Done"

       API:

       POST /payment/{requestId}

       Example:

       POST /payment/1

       BODY:

       {
           "paymentMethod": "PHONEPE",
           "paymentType": "PHONEPE",
           "amount": 5000,
           "requestId": 1
       }

    ============================================================ */
    public Payment createPayment(
            Long requestId,
            Long managerId,
            Double amount,
            String paymentMethod,
            String paymentType) {

    /* ========================================================
       1. VALIDATE REQUEST ID
    ======================================================== */

        if (requestId == null || requestId <= 0) {

            throw new RuntimeException(
                    "Invalid purchase request ID."
            );
        }


    /* ========================================================
       2. VALIDATE MANAGER ID
    ======================================================== */

        if (managerId == null || managerId <= 0) {

            throw new RuntimeException(
                    "Invalid manager ID."
            );
        }


    /* ========================================================
       3. FIND MANAGER
    ======================================================== */

        Manager manager =
                managerRepository
                        .findById(managerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found with id: "
                                                + managerId
                                )
                        );


    /* ========================================================
       4. FIND PURCHASE REQUEST
    ======================================================== */

        PurchaseRequest purchaseRequest =
                purchaseRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase request not found with id: "
                                                + requestId
                                )
                        );


    /* ========================================================
       5. CHECK REQUEST STATUS
    ======================================================== */

        if (purchaseRequest.getStatus() == null ||
                !purchaseRequest.getStatus()
                        .toString()
                        .equalsIgnoreCase("APPROVED")) {

            throw new RuntimeException(
                    "Only approved purchase requests can be paid."
            );
        }


    /* ========================================================
       6. VALIDATE AMOUNT
    ======================================================== */

        if (amount == null || amount <= 0) {

            throw new RuntimeException(
                    "Invalid payment amount."
            );
        }


    /* ========================================================
       7. VALIDATE PAYMENT METHOD
    ======================================================== */

        if (paymentMethod == null ||
                paymentMethod.trim().isEmpty()) {

            throw new RuntimeException(
                    "Payment method is required."
            );
        }


    /* ========================================================
       8. VALIDATE PAYMENT TYPE
    ======================================================== */

        if (paymentType == null ||
                paymentType.trim().isEmpty()) {

            throw new RuntimeException(
                    "Payment type is required."
            );
        }


    /* ========================================================
       9. CREATE PAYMENT
    ======================================================== */

        Payment payment = new Payment();


    /* ========================================================
       10. SET AMOUNT
    ======================================================== */

        payment.setAmount(amount);


    /* ========================================================
       11. SET MANAGER
    ======================================================== */

        payment.setManager(manager);


    /* ========================================================
       12. SET PAYMENT METHOD
    ======================================================== */

        payment.setPaymentMethod(
                paymentMethod.trim()
        );


    /* ========================================================
       13. SET PAYMENT TYPE
    ======================================================== */

        payment.setPaymentType(
                paymentType.trim()
        );


    /* ========================================================
       14. PAYMENT STATUS
    ======================================================== */

        payment.setPaymentStatus(
                "PAYED"
        );


    /* ========================================================
       15. PAYMENT VERIFIED
    ======================================================== */

        payment.setVerified(true);


    /* ========================================================
       16. PAYMENT DATE
    ======================================================== */

        payment.setPaymentDate(
                LocalDateTime.now()
        );


    /* ========================================================
       17. CONNECT PAYMENT WITH PURCHASE REQUEST
    ======================================================== */

        payment.setPurchaseRequest(
                purchaseRequest
        );


    /* ========================================================
       18. SAVE PAYMENT
    ======================================================== */

        Payment savedPayment =
                paymentRepository.save(payment);


    /* ========================================================
       19. SEND PAYMENT EMAIL TO SUPPLIER
    ======================================================== */

        try {

        /* ====================================================
           CHECK PRODUCT
        ==================================================== */

            if (purchaseRequest.getProduct() == null) {

                System.out.println(
                        "Payment saved successfully, "
                                + "but product is not associated with "
                                + "purchase request."
                );

                return savedPayment;
            }


        /* ====================================================
           CHECK SUPPLIER
        ==================================================== */

            if (purchaseRequest
                    .getProduct()
                    .getSupplier() == null) {

                System.out.println(
                        "Payment saved successfully, "
                                + "but supplier is not associated "
                                + "with the product."
                );

                return savedPayment;
            }


        /* ====================================================
           GET SUPPLIER EMAIL
        ==================================================== */

            String supplierEmail =
                    purchaseRequest
                            .getProduct()
                            .getSupplier()
                            .getEmail();


        /* ====================================================
           VALIDATE SUPPLIER EMAIL
        ==================================================== */

            if (supplierEmail == null ||
                    supplierEmail.trim().isEmpty()) {

                System.out.println(
                        "Payment saved successfully, "
                                + "but supplier email is not available."
                );

                return savedPayment;
            }


            supplierEmail =
                    supplierEmail.trim();


        /* ====================================================
           GET PRODUCT NAME
        ==================================================== */

            String productName =
                    purchaseRequest
                            .getProduct()
                            .getProductName();


            if (productName == null ||
                    productName.trim().isEmpty()) {

                productName = "Product";
            }


        /* ====================================================
           GET QUANTITY
        ==================================================== */

            Integer quantity =
                    purchaseRequest.getQuantity();


            if (quantity == null) {

                quantity = 0;
            }


        /* ====================================================
           EMAIL SUBJECT
        ==================================================== */

            String subject =
                    "PROCUREX - Payment Completed for Purchase Request PR-"
                            + requestId;


        /* ====================================================
           EMAIL BODY
        ==================================================== */

            String body =

                    "Dear Supplier,\n\n"

                            + "This is to inform you that the payment "
                            + "for the following purchase request has "
                            + "been successfully completed by the manager.\n\n"

                            + "========================================\n"
                            + "        PROCUREX PAYMENT CONFIRMATION\n"
                            + "========================================\n\n"

                            + "Purchase Request : PR-"
                            + requestId
                            + "\n\n"

                            + "Manager ID       : "
                            + managerId
                            + "\n\n"

                            + "Product          : "
                            + productName
                            + "\n\n"

                            + "Quantity         : "
                            + quantity
                            + "\n\n"

                            + "Amount           : ₹"
                            + String.format("%.2f", amount)
                            + "\n\n"

                            + "Payment Method   : "
                            + paymentMethod
                            + "\n\n"

                            + "Payment Type     : "
                            + paymentType
                            + "\n\n"

                            + "Payment Status   : PAYED"
                            + "\n\n"

                            + "Payment Date     : "
                            + savedPayment.getPaymentDate()
                            + "\n\n"

                            + "========================================\n\n"

                            + "The payment has been successfully "
                            + "recorded in the PROCUREX procurement system.\n\n"

                            + "You may now proceed with the order "
                            + "fulfillment process.\n\n"

                            + "Thank you,\n"
                            + "PROCUREX Procurement Team";


        /* ====================================================
           SEND EMAIL
        ==================================================== */

            emailService.sendEmail(
                    supplierEmail,
                    subject,
                    body
            );


        /* ====================================================
           SUCCESS LOG
        ==================================================== */

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "PAYMENT SUCCESS"
            );

            System.out.println(
                    "Payment ID: "
                            + savedPayment.getPaymentId()
            );

            System.out.println(
                    "Purchase Request: PR-"
                            + requestId
            );

            System.out.println(
                    "Manager ID: "
                            + managerId
            );

            System.out.println(
                    "Amount: "
                            + amount
            );

            System.out.println(
                    "Supplier Email: "
                            + supplierEmail
            );

            System.out.println(
                    "Supplier payment email sent successfully."
            );

            System.out.println(
                    "========================================"
            );


        } catch (Exception emailException) {

            /*
             * Payment has already been saved.
             * Email failure should not cancel payment.
             */

            System.err.println(
                    "========================================"
            );

            System.err.println(
                    "PAYMENT SAVED BUT EMAIL FAILED"
            );

            System.err.println(
                    "Purchase Request: PR-"
                            + requestId
            );

            System.err.println(
                    "Manager ID: "
                            + managerId
            );

            System.err.println(
                    "Email Error: "
                            + emailException.getMessage()
            );

            System.err.println(
                    "========================================"
            );
        }


    /* ========================================================
       20. RETURN SAVED PAYMENT
    ======================================================== */

        return savedPayment;
    }





    public boolean isPaymentCompleted(Long requestId) {

        PurchaseRequest purchaseRequest =
                purchaseRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase request not found with id: "
                                                + requestId
                                )
                        );

        return paymentRepository
                .existsByPurchaseRequest(purchaseRequest);
    }

    public PaymentResponseDto getPaymentByRequestId(Long requestId) {

        Payment payment =
                (Payment) paymentRepository
                        .findByPurchaseRequestRequestId(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found for request ID: "
                                                + requestId
                                )
                        );


        PaymentResponseDto dto =
                new PaymentResponseDto();


        /*
         * PAYMENT INFORMATION
         */

        dto.setPaymentId(
                payment.getPaymentId()
        );

        dto.setRequestId(
                payment.getPurchaseRequest()
                        .getRequestId()
        );

        dto.setAmount(
                payment.getAmount()
        );

        dto.setPaymentMethod(
                payment.getPaymentMethod()
        );

        dto.setPaymentType(
                payment.getPaymentType()
        );

        dto.setPaymentStatus(
                payment.getPaymentStatus()
        );



        dto.setPaymentDate(
                payment.getPaymentDate()
        );







        return dto;
    }
            public List<Payment> getAllPayedPayments() {

                return paymentRepository.findByPaymentStatus("PAYED");
            }

}

