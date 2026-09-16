package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.SupplierPaymentHistoryDto;
import com.example.InfosysSpringProject.Service.CsvService;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/csv")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class CsvController {

    private final CsvService csvService;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public CsvController(CsvService csvService) {
        this.csvService = csvService;
    }

    // =====================================================
    // DOWNLOAD USER CSV BY USER ID
    // =====================================================
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Resource> downloadUserCsv(
            @PathVariable Long userId
    ) {

        try {

            byte[] data =
                    csvService.downloadUserCsv(userId);

            ByteArrayResource resource =
                    new ByteArrayResource(data);

            return ResponseEntity.ok()

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"user_"
                                    + userId
                                    + ".csv\""
                    )

                    .contentType(
                            MediaType.parseMediaType(
                                    "text/csv"
                            )
                    )

                    .contentLength(
                            data.length
                    )

                    .body(resource);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =====================================================
    // DOWNLOAD MANAGER CSV
    // GET /csv/managers/download
    // =====================================================

    @GetMapping("/managers/download/{managerId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Resource> downloadManagerCsv(
            @PathVariable Long managerId
    ) {

        try {

            byte[] data =
                    csvService.downloadManagerCsv(
                            managerId
                    );

            ByteArrayResource resource =
                    new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=managers.csv"
                    )
                    .contentType(
                            MediaType.parseMediaType(
                                    "text/csv"
                            )
                    )
                    .contentLength(
                            data.length
                    )
                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/{managerId}/csv")
    public ResponseEntity<byte[]> downloadManagerPaymentCsv(
            @PathVariable Long managerId) {

        byte[] csvData =
                csvService.generatePaymentCsvByManagerId(managerId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=manager_" +
                                managerId +
                                "_payments.csv"
                )
                .contentType(
                        MediaType.parseMediaType("text/csv")
                )
                .body(csvData);
    }
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/payment-history/{supplierId}")
    public ResponseEntity<byte[]> getPaymentsBySupplierId(
            @PathVariable Long supplierId) {

        System.out.println(
                "-------------------------------------------------"
        );

        System.out.println(
                "SUPPLIER PAYMENT HISTORY API CALLED"
        );

        System.out.println(
                "Supplier ID: " + supplierId
        );


        byte[] payments =
                csvService.getPaymentsBySupplierId(
                        supplierId
                );





        for (byte payment : payments) {

            System.out.println(
                    "Payment ID: "
                            + payment
            );
        }


        System.out.println(
                "-------------------------------------------------"
        );


        return ResponseEntity.ok(payments);
    }
    @PreAuthorize("hasRole('SUPPLIER')")
    @GetMapping("/payment-history/{supplierId}/json")
    public ResponseEntity<List<SupplierPaymentHistoryDto>>
    getSupplierPaymentHistoryJson(
            @PathVariable("supplierId") Long supplierId) {

        List<SupplierPaymentHistoryDto> history =
                csvService.getSupplierPaymentHistory(supplierId);

        return ResponseEntity.ok(history);
    }


}