package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;


    // =========================
    // SAVE DEPARTMENT
    // =========================
    public Department saveDepartment(Department department) {

        if (department.getDepartment_manager() == null) {
            throw new RuntimeException(
                    "Manager ID is required"
            );
        }

        return departmentRepository.save(department);
    }


    // =========================
    // GET ALL DEPARTMENTS
    // =========================
    public List<Department> getAllDepartments() {

        return departmentRepository.findAll();
    }


    // =========================
    // GET DEPARTMENT BY ID
    // =========================
    public Department getDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with id: " + id
                        )
                );
    }


    // =========================
    // UPDATE DEPARTMENT
    // =========================
    public Department updateDepartment(
            Long id,
            Department department) {

        // Find department using Department ID
        Department existingDepartment =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found with id: " + id
                                )
                        );


        // Validate department name
        if (department.getDepartmentName() == null ||
                department.getDepartmentName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Department name is required"
            );
        }


        // Validate manager ID
        if (department.getDepartment_manager() == null) {

            throw new RuntimeException(
                    "Manager ID is required"
            );
        }


        // Update department name
        existingDepartment.setDepartmentName(
                department.getDepartmentName()
        );


        // Update manager ID
        existingDepartment.setDepartment_manager(
                department.getDepartment_manager()
        );


        // Save updated department
        return departmentRepository.save(existingDepartment);
    }


    // =========================
    // DELETE DEPARTMENT
    // =========================
    public void deleteDepartment(Long id) {

        // Check whether department exists
        if (!departmentRepository.existsById(id)) {

            throw new RuntimeException(
                    "Department not found with id: " + id
            );
        }

        departmentRepository.deleteById(id);
    }
}