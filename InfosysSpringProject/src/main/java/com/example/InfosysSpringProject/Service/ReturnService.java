package com.example.InfosysSpringProject.Service;


import com.example.InfosysSpringProject.Dto.ReturnRequestDto;

import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Entity.ReturnRequest;
import com.example.InfosysSpringProject.Entity.Supplier;

import com.example.InfosysSpringProject.Enum.ReturnStatus;

import com.example.InfosysSpringProject.Repository.ManagerRepository;


import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;
import com.example.InfosysSpringProject.Repository.ReturnRequestRepository;
import com.example.InfosysSpringProject.Repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReturnService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private EmailService emailService;


    // HOD creates return request
    public ReturnRequest createReturnRequest(
            ReturnRequestDto dto) {

        // Find purchase request
        PurchaseRequest purchaseRequest =
                purchaseRequestRepository
                        .findById(dto.getPurchaseRequestId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase request not found"
                                )
                        );


        // Find HOD
        Manager manager =
                managerRepository
                        .findById(dto.getManagerId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"
                                )
                        );


        // Find supplier
        Supplier supplier =
                supplierRepository
                        .findById(dto.getSupplierId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found"
                                )
                        );


        // Create return request
        ReturnRequest returnRequest =
                new ReturnRequest();


        returnRequest.setPurchaseRequest(
                purchaseRequest
        );


        returnRequest.setManager(
                manager
        );


        returnRequest.setSupplier(
                supplier
        );


        returnRequest.setReason(
                dto.getReason()
        );


        returnRequest.setDescription(
                dto.getDescription()
        );


        // Initial status
        returnRequest.setStatus(
                ReturnStatus.PENDING
        );


        // Current date
        returnRequest.setReturnDate(
                LocalDateTime.now()
        );


        // Save return request
        ReturnRequest savedReturn =
                returnRequestRepository.save(
                        returnRequest
                );


        // Send email to Manager
        emailService.sendEmail(
                manager.getEmail(),
                "Return Request Created",
                "Your return request has been created.\n\n"
                        + "Return ID: "
                        + savedReturn.getReturnId()
                        + "\nReason: "
                        + savedReturn.getReason()
                        + "\nStatus: PENDING"
        );


        // Send email to Supplier
        emailService.sendEmail(
                supplier.getEmail(),
                "New Product Return Request",
                "A return request has been created.\n\n"
                        + "Return ID: "
                        + savedReturn.getReturnId()
                        + "\nReason: "
                        + savedReturn.getReason()
                        + "\nDescription: "
                        + savedReturn.getDescription()
                        + "\nStatus: PENDING"
        );


        return savedReturn;
    }


    // Get all return requests
    public List<ReturnRequest> getAllReturns() {

        return returnRequestRepository.findAll();
    }


    // Get pending returns
    public List<ReturnRequest> getPendingReturns() {

        return returnRequestRepository
                .findByStatus(ReturnStatus.PENDING);
    }


    // Get returns requested by a particular HOD
    public List<ReturnRequest> getReturnsByManager(
            Long managerId) {

        return returnRequestRepository
                .findByManager_ManagerId(managerId);
    }


    // Supplier accepts return
    public ReturnRequest acceptReturn(
            Long returnId) {

        ReturnRequest returnRequest =
                returnRequestRepository
                        .findById(returnId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Return request not found"
                                )
                        );


        // Only pending returns can be accepted
        if (returnRequest.getStatus()
                != ReturnStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending returns can be accepted"
            );
        }


        // Change status
        returnRequest.setStatus(
                ReturnStatus.ACCEPTED
        );


        // Save
        ReturnRequest savedReturn =
                returnRequestRepository.save(
                        returnRequest
                );


        // Send email to HOD
        emailService.sendEmail(
                returnRequest.getManager().getEmail(),

                "Return Request Accepted",

                "Your return request has been accepted by the supplier.\n\n"
                        + "Return ID: "
                        + returnRequest.getReturnId()
                        + "\nReason: "
                        + returnRequest.getReason()
                        + "\nStatus: ACCEPTED"
        );


        return savedReturn;
    }


    // Supplier rejects return
    public ReturnRequest rejectReturn(
            Long returnId) {

        ReturnRequest returnRequest =
                returnRequestRepository
                        .findById(returnId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Return request not found"
                                )
                        );


        // Only pending returns can be rejected
        if (returnRequest.getStatus()
                != ReturnStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending returns can be rejected"
            );
        }


        // Change status
        returnRequest.setStatus(
                ReturnStatus.REJECTED
        );


        // Save
        ReturnRequest savedReturn =
                returnRequestRepository.save(
                        returnRequest
                );


        // Send email to HOD
        emailService.sendEmail(
                returnRequest.getManager().getEmail(),

                "Return Request Rejected",

                "Your return request has been rejected by the supplier.\n\n"
                        + "Return ID: "
                        + returnRequest.getReturnId()
                        + "\nReason: "
                        + returnRequest.getReason()
                        + "\nStatus: REJECTED"
        );


        return savedReturn;
    }


    // Product is physically returned
    public ReturnRequest markAsReturned(
            Long returnId) {

        ReturnRequest returnRequest =
                returnRequestRepository
                        .findById(returnId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Return request not found"
                                )
                        );


        // It must be accepted first
        if (returnRequest.getStatus()
                != ReturnStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Return must be accepted by supplier first"
            );
        }


        returnRequest.setStatus(
                ReturnStatus.RETURNED
        );


        ReturnRequest savedReturn =
                returnRequestRepository.save(
                        returnRequest
                );


        // Notify HOD
        emailService.sendEmail(
                returnRequest.getManager().getEmail(),

                "Product Returned",

                "The product return has been completed.\n\n"
                        + "Return ID: "
                        + returnRequest.getReturnId()
                        + "\nStatus: RETURNED"
        );


        return savedReturn;
    }
}