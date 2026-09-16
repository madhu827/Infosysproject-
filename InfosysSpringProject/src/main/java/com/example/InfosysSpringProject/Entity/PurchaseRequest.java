package com.example.InfosysSpringProject.Entity;

import com.example.InfosysSpringProject.Enum.OrderStatus;
import com.example.InfosysSpringProject.Enum.RequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class PurchaseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @NotNull(message = "Product is required")
    @ManyToOne
    @JoinColumn(name = "product_id",referencedColumnName = "productId")
    private Product product;

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "userId",referencedColumnName = "user_id")
    private User user;

    @NotNull(message = "Department is required")
    @ManyToOne
    @JoinColumn(name = "department_id",referencedColumnName = "departmentId")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status ;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    @NotNull(message = "total  is required")
    @Positive(message = "Totalprice must be greater than 0")
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.ORDER_PLACED;

    private String currentLocation;

    private LocalDate expectedDeliveryDate;

    private LocalDate dispatchedDate;

    private LocalDate deliveredDate;


}