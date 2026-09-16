package com.example.InfosysSpringProject.Repository;

import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest,Long> {




    @Query("SELECT p FROM PurchaseRequest p WHERE p.user.user_id = :userId") List<PurchaseRequest> findRequestsByUserId(@Param("userId") Long userId );

    List<PurchaseRequest> findByDepartment(Department department);


    List<PurchaseRequest> findRequestsByDepartment_DepartmentName(String departmentName);
}
