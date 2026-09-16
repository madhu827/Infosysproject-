package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.ManagerLoginDto;
import com.example.InfosysSpringProject.Dto.ManagerRegisterDto;
import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Repository.ManagerRepository;

import com.example.InfosysSpringProject.Service.ManagerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = "http://localhost:5173")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    // =========================================================
    // REGISTER MANAGER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerManager(
            @RequestBody ManagerRegisterDto dto) {

        try {

            Manager manager =
                    managerService.registerManager(dto);

            return new ResponseEntity<>(
                    manager,
                    HttpStatus.CREATED
            );

        } catch (Exception e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }


        // =========================================================
        // MANAGER LOGIN
        // =========================================================

        @PostMapping("/login")
        public ResponseEntity<?> login(
                @RequestBody ManagerLoginDto dto,
                HttpServletRequest request,
                HttpServletResponse response) {


            // -----------------------------------------------------
            // 1. Find manager by email
            // -----------------------------------------------------

            Manager manager =
                    managerRepository
                            .findByEmail(dto.getEmail())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Manager not found"
                                    )
                            );


            // -----------------------------------------------------
            // 2. Check password
            // -----------------------------------------------------

            if (!passwordEncoder.matches(
                    dto.getPassword(),
                    manager.getPassword())) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }


            // -----------------------------------------------------
            // 3. Create authentication
            // -----------------------------------------------------

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            manager.getEmail(),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_MANAGER"
                                    )
                            )
                    );


            // -----------------------------------------------------
            // 4. Create security context
            // -----------------------------------------------------

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);


            // -----------------------------------------------------
            // 5. Save authentication in HTTP session
            // -----------------------------------------------------

            SecurityContextRepository repository =
                    new HttpSessionSecurityContextRepository();

            repository.saveContext(
                    context,
                    request,
                    response
            );


            // -----------------------------------------------------
            // 6. Return manager information
            // -----------------------------------------------------

            return ResponseEntity.ok(manager);
        }


    // =========================================================
    // GET MANAGER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getManagerById(
            @PathVariable Long id) {

        try {

            Manager manager =
                    managerService.getManagerById(id);

            return new ResponseEntity<>(
                    manager,
                    HttpStatus.OK
            );

        } catch (Exception e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.NOT_FOUND
            );
        }
    }


    // =========================================================
    // GET ALL MANAGERS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllManagers() {

        try {

            List<Manager> managers =
                    managerService.getAllManagers();

            return new ResponseEntity<>(
                    managers,
                    HttpStatus.OK
            );

        } catch (Exception e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    // =========================================================
    // UPDATE MANAGER
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateManager(
            @PathVariable Long id,
            @RequestBody ManagerRegisterDto dto) {

        try {

            Manager updatedManager =
                    managerService.updateManager(
                            id,
                            dto
                    );

            return new ResponseEntity<>(
                    updatedManager,
                    HttpStatus.OK
            );

        } catch (Exception e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }


    // =========================================================
    // DELETE MANAGER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManager(
            @PathVariable Long id) {

        try {

            String message =
                    managerService.deleteManager(id);

            return new ResponseEntity<>(
                    message,
                    HttpStatus.OK
            );

        } catch (Exception e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.NOT_FOUND
            );
        }
    }
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/verify-pin")
    public ResponseEntity<?> verifyPin(
            @RequestBody Map<String, Object> request
    ) {

        Long managerId =
                Long.valueOf(
                        request.get("managerId").toString()
                );

        String pin =
                request.get("pin").toString();

        boolean verified =
                managerService.verifyPin(
                        managerId,
                        pin
                );

        if (verified) {

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "PIN verified successfully."
                    )
            );
        }

        return ResponseEntity.status(401).body(
                Map.of(
                        "success", false,
                        "message",
                        "Incorrect PIN."
                )
        );
    }
}