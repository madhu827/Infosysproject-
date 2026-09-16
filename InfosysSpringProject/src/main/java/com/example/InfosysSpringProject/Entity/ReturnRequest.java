package com.example.InfosysSpringProject.Entity;

import com.example.InfosysSpringProject.Enum.ReturnReason;
import com.example.InfosysSpringProject.Enum.ReturnStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "return_requests")
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long returnId;


    // Purchase which is being returned
    @ManyToOne
    @JoinColumn(name = "purchase_request_id")
    private PurchaseRequest purchaseRequest;


    // HOD who requested the return
    @ManyToOne
    @JoinColumn(name = "manager_id",referencedColumnName = "managerId")
    private Manager manager;


    // Supplier who sold the product
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;


    // Reason for return
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnReason reason;


    // Detailed explanation
    @Column(length = 500)
    private String description;


    // Return status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus status;


    // Date of return request
    private LocalDateTime returnDate;
}