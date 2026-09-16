package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.ReturnRequestDto;


import com.example.InfosysSpringProject.Entity.ReturnRequest;
import com.example.InfosysSpringProject.Service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('MANAGER')")
@RequestMapping("/return")
public class ReturnController {

    @Autowired
    private ReturnService returnService;


    // HOD creates return request
    @PostMapping("/request")
    public ReturnRequest createReturnRequest(
            @RequestBody ReturnRequestDto dto) {

        return returnService.createReturnRequest(dto);
    }


    // Get all returns
    @GetMapping("/all")
    public List<ReturnRequest> getAllReturns() {

        return returnService.getAllReturns();
    }


    // Get pending returns
    @GetMapping("/pending")
    public List<ReturnRequest> getPendingReturns() {

        return returnService.getPendingReturns();
    }


    // Get HOD returns
    @GetMapping("/manager/{managerId}")
    public List<ReturnRequest> getReturnsByManager(
            @PathVariable Long managerId) {

        return returnService
                .getReturnsByManager(managerId);
    }


    // SUPPLIER accepts return
    @PutMapping("/accept/{returnId}")
    public ReturnRequest acceptReturn(
            @PathVariable Long returnId) {

        return returnService
                .acceptReturn(returnId);
    }


    // SUPPLIER rejects return
    @PutMapping("/reject/{returnId}")
    public ReturnRequest rejectReturn(
            @PathVariable Long returnId) {

        return returnService
                .rejectReturn(returnId);
    }


    // Product physically returned
    @PutMapping("/returned/{returnId}")
    public ReturnRequest markAsReturned(
            @PathVariable Long returnId) {

        return returnService
                .markAsReturned(returnId);
    }
}