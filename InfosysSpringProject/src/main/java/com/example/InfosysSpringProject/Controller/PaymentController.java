package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.PaymentResponseDto;
import com.example.InfosysSpringProject.Entity.Payment;
import com.example.InfosysSpringProject.Service.PaymentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@PreAuthorize("hasRole('MANAGER')")
@RequestMapping("/payment")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class PaymentController {

    private final PaymentService paymentService;


    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }


    /* =========================================================
       PAYMENT DONE

       React calls:

       POST /payment/{requestId}

       JSON:

       {
           "paymentMethod": "PHONEPE",
           "paymentType": "PHONEPE",
           "amount": 5000,
           "requestId": 1
       }
    ========================================================= */

    @PostMapping("/{requestId}")
    public ResponseEntity<?> createPayment(

            @PathVariable Long requestId,

            @RequestBody Map<String, Object> request) {

        try {

        /* =================================================
           VALIDATE REQUEST ID
        ================================================= */

            if (requestId == null || requestId <= 0) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Invalid request ID."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }


        /* =================================================
           GET MANAGER ID
        ================================================= */

            Object managerIdObject =
                    request.get("managerId");

            if (managerIdObject == null) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Manager ID is required."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }

            Long managerId =
                    Long.valueOf(
                            managerIdObject.toString()
                    );


            if (managerId <= 0) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Invalid manager ID."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }


        /* =================================================
           GET AMOUNT
        ================================================= */

            Object amountObject =
                    request.get("amount");

            if (amountObject == null) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Payment amount is required."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }

            Double amount =
                    Double.valueOf(
                            amountObject.toString()
                    );


            if (amount <= 0) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Payment amount must be greater than zero."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }


        /* =================================================
           GET PAYMENT METHOD
        ================================================= */

            Object paymentMethodObject =
                    request.get("paymentMethod");

            if (paymentMethodObject == null) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Payment method is required."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }

            String paymentMethod =
                    paymentMethodObject
                            .toString()
                            .trim();


        /* =================================================
           GET PAYMENT TYPE
        ================================================= */

            Object paymentTypeObject =
                    request.get("paymentType");

            if (paymentTypeObject == null) {

                Map<String, String> error = new HashMap<>();

                error.put(
                        "message",
                        "Payment type is required."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }

            String paymentType =
                    paymentTypeObject
                            .toString()
                            .trim();


        /* =================================================
           LOG PAYMENT DATA
        ================================================= */

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "Creating Payment"
            );

            System.out.println(
                    "Request ID   : " + requestId
            );

            System.out.println(
                    "Manager ID   : " + managerId
            );

            System.out.println(
                    "Amount       : " + amount
            );

            System.out.println(
                    "Payment Method : " + paymentMethod
            );

            System.out.println(
                    "Payment Type   : " + paymentType
            );

            System.out.println(
                    "========================================"
            );


        /* =================================================
           SAVE PAYMENT
        ================================================= */

            Payment payment =
                    paymentService.createPayment(

                            requestId,

                            managerId,

                            amount,

                            paymentMethod,

                            paymentType
                    );


        /* =================================================
           RESPONSE
        ================================================= */

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Payment completed successfully."
            );

            response.put(
                    "paymentId",
                    payment.getPaymentId()
            );

            response.put(
                    "requestId",
                    requestId
            );

            response.put(
                    "managerId",
                    managerId
            );

            response.put(
                    "amount",
                    payment.getAmount()
            );

            response.put(
                    "paymentMethod",
                    payment.getPaymentMethod()
            );

            response.put(
                    "paymentType",
                    payment.getPaymentType()
            );

            response.put(
                    "paymentStatus",
                    payment.getPaymentStatus()
            );

            response.put(
                    "verified",
                    payment.getVerified()
            );

            response.put(
                    "paymentDate",
                    payment.getPaymentDate()
            );


            return ResponseEntity.ok(response);


        } catch (NumberFormatException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Invalid manager ID or payment amount."
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);


        } catch (RuntimeException e) {

            e.printStackTrace();

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Payment could not be completed."
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);


        } catch (Exception e) {

            e.printStackTrace();

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Payment could not be completed."
            );

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(error);
        }
    }
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/status/{requestId}")
    public ResponseEntity<?> checkPaymentStatus(
            @PathVariable Long requestId) {

        boolean completed =
                paymentService.isPaymentCompleted(requestId);

        return ResponseEntity.ok(
                Map.of(
                        "requestId", requestId,
                        "paymentCompleted", completed
                )
        );
    }
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/request/{requestId}")
    public ResponseEntity<PaymentResponseDto>
    getPaymentByRequestId(
            @PathVariable Long requestId
    ) {

        PaymentResponseDto payment =
                paymentService.getPaymentByRequestId(
                        requestId
                );

        return ResponseEntity.ok(payment);
    }
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/payed")
    public ResponseEntity<?> getAllPayedPayments() {

        try {

            List<Payment> payments =
                    paymentService.getAllPayedPayments();

            return ResponseEntity.ok(payments);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to retrieve payed payments",
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}