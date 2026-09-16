package com.example.InfosysSpringProject.Repository;

import com.example.InfosysSpringProject.Entity.ReturnRequest;


import com.example.InfosysSpringProject.Enum.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReturnRequestRepository
        extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByStatus(ReturnStatus status);





    List<ReturnRequest> findByManager_ManagerId(Long managerId);

}
