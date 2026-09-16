package com.example.InfosysSpringProject.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.InfosysSpringProject.Dto.ProductRatingDto;
import com.example.InfosysSpringProject.Entity.ProductRating;
import com.example.InfosysSpringProject.Service.ProductRatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasAnyRole('MANAGER','SUPPLIER')")
@RequestMapping("/product-rating")
public class ProductRatingController {

    @Autowired
    private ProductRatingService ratingService;


    // ADD RATING
    @PostMapping("/add/{managerId}")
    public ResponseEntity<ProductRating> addRating(
            @RequestBody ProductRatingDto dto,
            @PathVariable Long managerId) {

        ProductRating rating =
                ratingService.addRating(
                        dto,
                        managerId
                );

        return ResponseEntity.ok(rating);
    }


    // GET RATINGS FOR A PRODUCT
    @GetMapping("/status/{managerId}")
    public ResponseEntity<List<ProductRating>> getReviewsByManagerId(
            @PathVariable Long managerId) {

        List<ProductRating> ratings =
                ratingService.getReviewsByManagerId(managerId);

        return ResponseEntity.ok(ratings);
    }
    @GetMapping("/{requestId}")
    public ResponseEntity<Boolean> checkFeedbackStatus(
            @PathVariable Long requestId) {

        boolean completed =
                ratingService
                        .isFeedbackCompleted(requestId);

        return ResponseEntity.ok(completed);
    }

}