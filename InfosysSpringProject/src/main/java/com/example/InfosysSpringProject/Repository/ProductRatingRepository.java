package com.example.InfosysSpringProject.Repository;

import java.util.List;
import java.util.Optional;

import com.example.InfosysSpringProject.Entity.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {


    List<ProductRating> findByManagerManagerId(Long managerId);

    boolean existsByRequestId(Long requestId);
}