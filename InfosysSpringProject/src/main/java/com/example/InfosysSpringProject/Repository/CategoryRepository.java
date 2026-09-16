package com.example.InfosysSpringProject.Repository;

import com.example.InfosysSpringProject.Entity.Category;
import com.example.InfosysSpringProject.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    List<Category> findByDepartmentDepartmentId(Long departmentId);


    Optional<Product> findByCategoryNameIgnoreCase(String categoryName);
}
