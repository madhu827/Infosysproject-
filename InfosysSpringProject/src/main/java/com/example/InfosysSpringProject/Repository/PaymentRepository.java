package com.example.InfosysSpringProject.Repository;

import com.example.InfosysSpringProject.Entity.Payment;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Enum.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByPurchaseRequest(PurchaseRequest purchaseRequest);

    Optional<Payment> findByPurchaseRequestRequestId(Long requestId);

    List<Payment> findByPaymentStatus(String paymentStatus);

    List<Payment> findByManager_ManagerId(Long managerId);

    @Query("""
        SELECT DISTINCT p
        FROM Payment p
        JOIN p.purchaseRequest pr
        JOIN pr.product product
        JOIN product.supplier supplier
        WHERE supplier.supplierId = :supplierId
        ORDER BY p.paymentId DESC
    """)
    List<Payment> findAllPaymentsBySupplierId(
            @Param("supplierId") Long supplierId
    );

    @Query("""
        SELECT p
        FROM Payment p
        WHERE p.purchaseRequest.product.supplier.supplierId = :supplierId
        ORDER BY p.paymentId ASC
    """)
    List<Payment> findPaymentsBySupplierId(
            @Param("supplierId") Long supplierId
    );

    Payment findByPurchaseRequest_RequestId(Long requestId);
}