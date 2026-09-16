package com.example.InfosysSpringProject.Controller;

import com.example.InfosysSpringProject.Dto.UserLoginDto;
import com.example.InfosysSpringProject.Dto.UserRegisterDto;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Repository.UserRepository;
import com.example.InfosysSpringProject.Service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityContextRepository securityContextRepository;


    // =========================================================
    // USER REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @Valid @RequestBody UserRegisterDto userRegisterDto) {

        System.out.println("========== REGISTER CONTROLLER CALLED ==========");
        System.out.println("Email: " + userRegisterDto.getEmail());

        return ResponseEntity.ok(
                userService.register(userRegisterDto)
        );
    }


    // =========================================================
    // USER LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserLoginDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        // 1. Find user by email
        User user = userRepository
                .findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Check password
        if (!passwordEncoder.matches(
                dto.getUser_password(),
                user.getUser_password())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }


        // 3. Create authentication
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_USER"
                                )
                        )
                );


        // 4. Create security context
        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);


        // 5. Save authentication in HTTP session
        SecurityContextRepository repository =
                new HttpSessionSecurityContextRepository();

        repository.saveContext(
                context,
                request,
                response
        );


        // 6. Return user information to React
        return ResponseEntity.ok(user);
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public ResponseEntity<List<User>> getallusers() {

        return ResponseEntity.ok(
                userService.getallusers()
        );
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteuser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.deleteuser(id)
        );
    }
}