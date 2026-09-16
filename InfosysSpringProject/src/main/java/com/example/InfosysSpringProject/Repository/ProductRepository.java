package com.example.InfosysSpringProject.Repository;

import com.example.InfosysSpringProject.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    Optional<Product> findByProductName(String productName);


    List<Product> findByDepartment_DepartmentName(String departmentName);

    @Query("SELECT p FROM Product p WHERE p.supplier.supplierId = :supplierId")
    List<Product> findProductsBySupplierId(
            @Param("supplierId") Long supplierId
    );
}
