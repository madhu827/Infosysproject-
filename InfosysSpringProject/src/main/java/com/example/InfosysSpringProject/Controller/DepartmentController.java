package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/department")

public class DepartmentController {

        @Autowired
        private DepartmentService departmentService;

        @PostMapping
        public ResponseEntity<String> saveDepartment(@RequestBody Department department) {
            departmentService.saveDepartment(department);
            return ResponseEntity.ok("department created successfully");
        }


        @GetMapping
        public ResponseEntity<List<Department>> getAllDepartments() {
            return new ResponseEntity<>(departmentService.getAllDepartments(),HttpStatus.OK);
        }


        @GetMapping("/{id}")
        public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
            return new ResponseEntity<>( departmentService.getDepartmentById(id),HttpStatus.OK);
        }



        @PutMapping("/{id}")
        public ResponseEntity<String> updateDepartment(@PathVariable Long id,
                                           @RequestBody Department department) {
            departmentService.updateDepartment(id, department);
            return ResponseEntity.ok("department updated successfully");
        }


        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok("Department deleted successfully");
        }
    @ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException(RuntimeException ex) {
        return ex.getMessage();
    }

    }

