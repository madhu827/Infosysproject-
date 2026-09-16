package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.ManagerRegisterDto;
import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Enum.Role;
import com.example.InfosysSpringProject.Repository.DepartmentRepository;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ManagerService {

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CsvService csvService;


    // =========================================================
    // REGISTER MANAGER
    // =========================================================

    public Manager registerManager(ManagerRegisterDto dto) {

        // =====================================================
        // VALIDATE MANAGER NAME
        // =====================================================

        if (dto.getManagerName() == null ||
                dto.getManagerName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Manager name is required"
            );
        }


        // =====================================================
        // VALIDATE EMAIL
        // =====================================================

        if (dto.getEmail() == null ||
                dto.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        String email =
                dto.getEmail().trim();


        // =====================================================
        // VALIDATE PASSWORD
        // =====================================================

        if (dto.getPassword() == null ||
                dto.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        // =====================================================
        // VALIDATE DEPARTMENT
        // =====================================================

        if (dto.getDepartment() == null ||
                dto.getDepartment().trim().isEmpty()) {

            throw new RuntimeException(
                    "Department is required"
            );
        }

        String departmentName =
                dto.getDepartment().trim();


        // =====================================================
        // CHECK EMAIL ALREADY EXISTS
        // =====================================================

        if (managerRepository
                .findByEmail(email)
                .isPresent()) {

            throw new RuntimeException(
                    "Manager with this email already exists"
            );
        }


        // =====================================================
        // FIND DEPARTMENT
        // =====================================================

        Department department =
                departmentRepository
                        .findByDepartmentNameIgnoreCase(
                                departmentName
                        )
                        .orElse(null);


        // =====================================================
        // CREATE DEPARTMENT IF NOT EXISTS
        // =====================================================

        if (department == null) {

            department = new Department();

            department.setDepartmentName(
                    departmentName
            );

            department.setDepartment_manager(
                    dto.getManagerName().trim()
            );

            department =
                    departmentRepository.save(
                            department
                    );
        }


        // =====================================================
        // CREATE MANAGER
        // =====================================================

        Manager manager =
                new Manager();


        // =====================================================
        // SET MANAGER NAME
        // =====================================================

        manager.setManagerName(
                dto.getManagerName().trim()
        );


        // =====================================================
        // SET EMAIL
        // =====================================================

        manager.setEmail(
                email
        );


        // =====================================================
        // ENCODE PASSWORD
        // =====================================================

        manager.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );


        // =====================================================
        // SET ROLE
        // =====================================================

        manager.setRole(
                Role.MANAGER
        );


        // =====================================================
        // SET DEPARTMENT
        // =====================================================

        manager.setDepartment(
                department
        );


        // =====================================================
        // SAVE MANAGER TO DATABASE
        // =====================================================

        Manager savedManager =
                managerRepository.save(
                        manager
                );


        // =====================================================
        // SEND REGISTRATION EMAIL
        // =====================================================

        try {

            String subject =
                    "Manager Registration Successful";


            String body =
                    "Hello " +
                            savedManager.getManagerName() +
                            ",\n\n" +

                            "Your manager account has been successfully "
                            + "registered.\n\n" +

                            "Manager Name: " +
                            savedManager.getManagerName() +
                            "\n\n" +

                            "Email: " +
                            savedManager.getEmail() +
                            "\n\n" +

                            "Department: " +
                            department.getDepartmentName() +
                            "\n\n" +

                            "Role: MANAGER\n\n" +

                            "You can now login to the system using "
                            + "your registered email and password.\n\n" +

                            "Thank you,\n" +
                            "InfosysSpringProject Team";


            emailService.sendEmail(
                    savedManager.getEmail(),
                    subject,
                    body
            );


            System.out.println(
                    "Manager registration email sent successfully"
            );

        } catch (Exception e) {

            System.out.println(
                    "Manager registered successfully, "
                            + "but email could not be sent: "
                            + e.getMessage()
            );
        }


        // =====================================================
        // RETURN SAVED MANAGER
        // =====================================================

        return savedManager;
    }

    // =========================================================
    // LOGIN MANAGER
    // =========================================================

    // ==========================================
// LOGIN MANAGER
// ==========================================

    public Map<String, Object> login(Manager manager) {

        // ==========================================
        // FIND MANAGER BY EMAIL
        // ==========================================

        Manager existingManager =
                managerRepository
                        .findByEmail(manager.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"
                                )
                        );


        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (existingManager.getRole() != Role.MANAGER) {

            throw new RuntimeException(
                    "This user is not a manager"
            );
        }


        // ==========================================
        // CHECK BCRYPT PASSWORD
        // ==========================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        manager.getPassword(),
                        existingManager.getPassword()
                );


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        if (passwordMatches) {

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "message",
                    "Manager Login Successful"
            );


            response.put(
                    "manager",
                    existingManager
            );


            response.put(
                    "role",
                    existingManager.getRole()
            );


            return response;
        }


        // ==========================================
        // INVALID PASSWORD
        // ==========================================

        throw new RuntimeException(
                "Invalid Password"
        );
    }


    // =========================================================
    // GET MANAGER BY ID
    // =========================================================

    public Manager getManagerById(Long id) {

        return managerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Manager not found with id: " + id
                        )
                );
    }


    // =========================================================
    // GET ALL MANAGERS
    // =========================================================

    public List<Manager> getAllManagers() {

        return managerRepository.findAll();
    }


    // =========================================================
    // UPDATE MANAGER
    // =========================================================

    public Manager updateManager(
            Long id,
            ManagerRegisterDto dto) {


        // -----------------------------------------------------
        // FIND MANAGER
        // -----------------------------------------------------

        Manager manager =
                managerRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // UPDATE NAME
        // -----------------------------------------------------

        if (dto.getManagerName() != null &&
                !dto.getManagerName().trim().isEmpty()) {

            manager.setManagerName(
                    dto.getManagerName().trim()
            );
        }


        // -----------------------------------------------------
        // UPDATE EMAIL
        // -----------------------------------------------------

        if (dto.getEmail() != null &&
                !dto.getEmail().trim().isEmpty()) {

            String newEmail =
                    dto.getEmail().trim();

            // Check whether another manager already
            // has this email

            if (!newEmail.equalsIgnoreCase(
                    manager.getEmail())) {

                if (managerRepository
                        .findByEmail(newEmail)
                        .isPresent()) {

                    throw new RuntimeException(
                            "Email already used by another manager"
                    );
                }
            }

            manager.setEmail(newEmail);
        }


        // -----------------------------------------------------
        // UPDATE PASSWORD
        // -----------------------------------------------------

        if (dto.getPassword() != null &&
                !dto.getPassword().trim().isEmpty()) {

            manager.setPassword(
                    passwordEncoder.encode(
                            dto.getPassword()
                    )
            );
        }


        // -----------------------------------------------------
        // UPDATE DEPARTMENT
        // -----------------------------------------------------

        if (dto.getDepartment() != null &&
                !dto.getDepartment().trim().isEmpty()) {

            String departmentName =
                    dto.getDepartment().trim();


            Department department =
                    departmentRepository
                            .findByDepartmentNameIgnoreCase(
                                    departmentName
                            )
                            .orElse(null);


            // -------------------------------------------------
            // CREATE DEPARTMENT IF NOT EXISTS
            // -------------------------------------------------

            if (department == null) {

                department = new Department();

                department.setDepartmentName(
                        departmentName
                );

                department.setDepartment_manager(
                        manager.getManagerName()
                );

                department =
                        departmentRepository.save(
                                department
                        );
            }


            manager.setDepartment(department);
        }


        // -----------------------------------------------------
        // ALWAYS KEEP MANAGER ROLE
        // -----------------------------------------------------

        manager.setRole(Role.MANAGER);


        // -----------------------------------------------------
        // SAVE UPDATED MANAGER
        // -----------------------------------------------------

        return managerRepository.save(manager);
    }


    // =========================================================
    // DELETE MANAGER
    // =========================================================

    public String deleteManager(Long id) {

        Manager manager =
                managerRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found with id: "
                                                + id
                                )
                        );


        managerRepository.delete(manager);


        return "Manager deleted successfully";
    }
    public boolean verifyPin(Long managerId, String pin) {

        Manager manager = managerRepository
                .findById(managerId)
                .orElse(null);

        if (manager == null) {
            return false;
        }

        return manager.getPin().equals(pin);
    }
}