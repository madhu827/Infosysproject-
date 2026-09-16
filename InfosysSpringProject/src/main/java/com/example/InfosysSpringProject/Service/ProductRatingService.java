package com.example.InfosysSpringProject.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.InfosysSpringProject.Dto.ProductRatingDto;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Product;
import com.example.InfosysSpringProject.Entity.ProductRating;
import com.example.InfosysSpringProject.Entity.PurchaseRequest;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.ProductRatingRepository;
import com.example.InfosysSpringProject.Repository.PurchaseRequestRepository;

@Service
public class ProductRatingService {

    @Autowired
    private ProductRatingRepository ratingRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private ManagerRepository managerRepository;


    // =========================================================
    // ADD RATING / FEEDBACK FOR A PURCHASE REQUEST
    // =========================================================

    public ProductRating addRating(
            ProductRatingDto dto,
            Long managerId) {

        // ---------------------------------------------
        // Validate requestId
        // ---------------------------------------------

        if (dto.getRequestId() == null) {
            throw new RuntimeException("Request ID is required");
        }

        // ---------------------------------------------
        // Find Purchase Request
        // ---------------------------------------------

        PurchaseRequest purchaseRequest =
                purchaseRequestRepository
                        .findById(dto.getRequestId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase request not found with id: "
                                                + dto.getRequestId()
                                )
                        );


        // ---------------------------------------------
        // Get Product from Purchase Request
        // ---------------------------------------------

        Product product = purchaseRequest.getProduct();

        if (product == null) {
            throw new RuntimeException(
                    "Product not found for request id: "
                            + dto.getRequestId()
            );
        }


        // ---------------------------------------------
        // Find Manager
        // ---------------------------------------------

        Manager manager =
                managerRepository
                        .findById(managerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found with id: "
                                                + managerId
                                )
                        );


        // ---------------------------------------------
        // Validate Rating
        // ---------------------------------------------

        if (dto.getRating() == null) {
            throw new RuntimeException("Rating is required");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }


        // ---------------------------------------------
        // Create ProductRating
        // ---------------------------------------------

        ProductRating productRating =
                new ProductRating();



        productRating.setProduct(product);

        productRating.setManager(manager);

        productRating.setRating(dto.getRating());

        productRating.setComment(dto.getComment());
        productRating.setRequestId(dto.getRequestId());

        productRating.setCreatedAt(
                LocalDateTime.now()
        );


        // ---------------------------------------------
        // Save Rating
        // ---------------------------------------------

        return ratingRepository.save(productRating);
    }


    public List<ProductRating> getReviewsByManagerId(Long managerId) {
        return ratingRepository.findByManagerManagerId(managerId);
    }

    public boolean isFeedbackCompleted(Long requestId) {

        if (requestId == null) {
            return false;
        }

        return ratingRepository
                .existsByRequestId(requestId);
    }
}