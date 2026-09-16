package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Entity.Category;
import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Repository.CategoryRepository;
import com.example.InfosysSpringProject.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Category> getCategoriesByDepartmentId(Long departmentId) {
        return categoryRepository.findByDepartmentDepartmentId(departmentId);
    }

    public Category saveCategory(Category category) {
        Long departmentId = category.getDepartment().getDepartmentId();

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        category.setDepartment(department);

        return categoryRepository.save(category);

    }

    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    public Category updateCategory(Long id, Category category) {


            Category existingCategory = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            existingCategory.setCategoryName(category.getCategoryName());
            existingCategory.setDepartment(category.getDepartment());

            return categoryRepository.save(existingCategory);

    }

    public String deleteCategory(Long id) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(existingCategory);

        return "Category deleted successfully";
    }
}
