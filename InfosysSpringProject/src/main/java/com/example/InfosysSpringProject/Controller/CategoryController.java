package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Entity.Category;
import com.example.InfosysSpringProject.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('MANAGER')")
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;


    @GetMapping("/{departmentId}")
    public List<Category> getCategoriesByDepartmentId(
            @PathVariable Long departmentId) {

        return categoryService.getCategoriesByDepartmentId(departmentId);
    }
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {



        return new ResponseEntity<>(categoryService.saveCategory(category), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {

        List<Category> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        Category updatedCategory = categoryService.updateCategory(id, category);

        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {

        String message = categoryService.deleteCategory(id);

        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
