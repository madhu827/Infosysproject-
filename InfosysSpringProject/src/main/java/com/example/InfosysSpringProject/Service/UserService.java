package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Dto.UserLoginDto;
import com.example.InfosysSpringProject.Dto.UserRegisterDto;
import com.example.InfosysSpringProject.Entity.Department;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Enum.Role;
import com.example.InfosysSpringProject.Repository.DepartmentRepository;
import com.example.InfosysSpringProject.Repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;


    // =========================================================
    // REGISTER USER
    // =========================================================

    public User register(@Valid UserRegisterDto dto) {

        // Validate username
        if (dto.getUserName() == null ||
                dto.getUserName().trim().isEmpty()) {

            throw new RuntimeException("User name is required");
        }

        String userName = dto.getUserName().trim();


        // Validate email
        if (dto.getEmail() == null ||
                dto.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        String email = dto.getEmail().trim();


        // Validate password
        if (dto.getUser_password() == null ||
                dto.getUser_password().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }


        // Validate department
        if (dto.getDepartment() == null ||
                dto.getDepartment().trim().isEmpty()) {

            throw new RuntimeException("Department is required");
        }

        String departmentName = dto.getDepartment().trim();


        // Check duplicate email
        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "User with this email already exists"
            );
        }


        // Find department
        Department department =
                departmentRepository
                        .findByDepartmentNameIgnoreCase(departmentName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found: "
                                                + departmentName
                                )
                        );


        // Create user
        User user = new User();


        // Set username
        user.setUserName(userName);


        // Set email
        user.setEmail(email);


        // Encode password
        user.setUser_password(
                passwordEncoder.encode(
                        dto.getUser_password()
                )
        );


        // Set phone
        if (dto.getUser_phoneno() != null &&
                !dto.getUser_phoneno().trim().isEmpty()) {

            user.setUser_phoneno(
                    dto.getUser_phoneno().trim()
            );
        }


        // Set designation
        if (dto.getDesignation() != null &&
                !dto.getDesignation().trim().isEmpty()) {

            user.setDesignation(
                    dto.getDesignation().trim()
            );
        }


        // Set role
        user.setRole(Role.USER);


        // Set department
        user.setDepartment(department);


        // Save user
        User savedUser = userRepository.save(user);





        // =====================================================
        // SEND REGISTRATION EMAIL
        // =====================================================

        try {

            String subject =
                    "User Registration Successful";

            String body =
                    "Hello " +
                            savedUser.getUserName() +
                            ",\n\n" +

                            "Your account has been successfully " +
                            "registered in InfosysSpringProject.\n\n" +

                            "----------------------------------------\n" +
                            "USER DETAILS\n" +
                            "----------------------------------------\n\n" +

                            "Name: " +
                            savedUser.getUserName() +
                            "\n\n" +

                            "Email: " +
                            savedUser.getEmail() +
                            "\n\n" +

                            "Phone Number: " +
                            savedUser.getUser_phoneno() +
                            "\n\n" +

                            "Designation: " +
                            savedUser.getDesignation() +
                            "\n\n" +

                            "Department: " +
                            department.getDepartmentName() +
                            "\n\n" +

                            "Role: USER\n\n" +

                            "----------------------------------------\n\n" +

                            "Your registration was successful.\n\n" +

                            "You can now login using your " +
                            "registered email and password.\n\n" +

                            "Please keep your password secure.\n\n" +

                            "Thank you,\n" +
                            "InfosysSpringProject Team";


            emailService.sendEmail(
                    savedUser.getEmail(),
                    subject,
                    body
            );

            System.out.println(
                    "User registration email sent successfully"
            );

        } catch (Exception e) {

            System.out.println(
                    "User registered successfully, " +
                            "but email sending failed: " +
                            e.getMessage()
            );
        }


        return savedUser;
    }


    // =========================================================
    // LOGIN USER
    // =========================================================

    public User login(UserLoginDto dto) {

        // -----------------------------------------------------
        // VALIDATE DTO
        // -----------------------------------------------------

        if (dto == null) {

            throw new RuntimeException(
                    "Login details are required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (dto.getEmail() == null ||
                dto.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (dto.getUser_password() == null ||
                dto.getUser_password().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        String email = dto.getEmail().trim();


        // -----------------------------------------------------
        // FIND USER BY EMAIL
        // -----------------------------------------------------

        User existingUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // -----------------------------------------------------
        // CHECK ROLE
        // -----------------------------------------------------

        if (existingUser.getRole() != Role.USER) {

            throw new RuntimeException(
                    "This account is not a USER account"
            );
        }


        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        boolean passwordMatches =
                passwordEncoder.matches(
                        dto.getUser_password(),
                        existingUser.getUser_password()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // -----------------------------------------------------
        // LOGIN SUCCESS
        // -----------------------------------------------------

        return existingUser;
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    public User getUserById(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getallusers() {

        return userRepository.findAll();
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateuser(
            Long id,
            UserRegisterDto dto) {

        // Find user
        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // UPDATE USERNAME
        // -----------------------------------------------------

        if (dto.getUserName() != null &&
                !dto.getUserName().trim().isEmpty()) {

            user.setUserName(
                    dto.getUserName().trim()
            );
        }


        // -----------------------------------------------------
        // UPDATE EMAIL
        // -----------------------------------------------------

        if (dto.getEmail() != null &&
                !dto.getEmail().trim().isEmpty()) {

            String newEmail =
                    dto.getEmail().trim();


            if (!newEmail.equalsIgnoreCase(
                    user.getEmail())) {

                if (userRepository
                        .findByEmail(newEmail)
                        .isPresent()) {

                    throw new RuntimeException(
                            "Email already used by another user"
                    );
                }
            }


            user.setEmail(newEmail);
        }


        // -----------------------------------------------------
        // UPDATE PASSWORD
        // -----------------------------------------------------

        if (dto.getUser_password() != null &&
                !dto.getUser_password().trim().isEmpty()) {

            user.setUser_password(
                    passwordEncoder.encode(
                            dto.getUser_password()
                    )
            );
        }


        // -----------------------------------------------------
        // UPDATE PHONE
        // -----------------------------------------------------

        if (dto.getUser_phoneno() != null &&
                !dto.getUser_phoneno().trim().isEmpty()) {

            user.setUser_phoneno(
                    dto.getUser_phoneno().trim()
            );
        }


        // -----------------------------------------------------
        // UPDATE DESIGNATION
        // -----------------------------------------------------

        if (dto.getDesignation() != null &&
                !dto.getDesignation().trim().isEmpty()) {

            user.setDesignation(
                    dto.getDesignation().trim()
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
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department not found: "
                                                    + departmentName
                                    )
                            );


            user.setDepartment(department);
        }


        // -----------------------------------------------------
        // KEEP ROLE AS USER
        // -----------------------------------------------------

        user.setRole(Role.USER);


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        return userRepository.save(user);
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public String deleteuser(Long id) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + id
                                )
                        );


        userRepository.delete(user);


        return "User deleted successfully";
    }
}