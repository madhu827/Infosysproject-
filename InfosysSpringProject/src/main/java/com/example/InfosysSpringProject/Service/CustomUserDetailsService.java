package com.example.InfosysSpringProject.Service;

import com.example.InfosysSpringProject.Entity.Manager;
import com.example.InfosysSpringProject.Entity.Supplier;
import com.example.InfosysSpringProject.Entity.User;
import com.example.InfosysSpringProject.Repository.ManagerRepository;
import com.example.InfosysSpringProject.Repository.SupplierRepository;
import com.example.InfosysSpringProject.Repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;
    private final ManagerRepository managerRepository;
    private final SupplierRepository supplierRepository;

    public CustomUserDetailsService(
            UserRepository userRepository,
            ManagerRepository managerRepository,
            SupplierRepository supplierRepository) {

        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // ==========================
        // CHECK USER
        // ==========================

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {

            return new org.springframework.security.core.userdetails.User(

                    user.get().getEmail(),

                    user.get().getUser_password(),

                    Collections.singletonList(
                            new SimpleGrantedAuthority(
                                    "ROLE_" +
                                            user.get().getRole().name()
                            )
                    )
            );
        }


        // ==========================
        // CHECK MANAGER
        // ==========================

        Optional<Manager> manager =
                managerRepository.findByEmail(email);

        if (manager.isPresent()) {

            return new org.springframework.security.core.userdetails.User(

                    manager.get().getEmail(),

                    manager.get().getPassword(),

                    Collections.singletonList(
                            new SimpleGrantedAuthority(
                                    "ROLE_" +
                                            manager.get().getRole().name()
                            )
                    )
            );
        }


        // ==========================
        // CHECK SUPPLIER
        // ==========================

        Optional<Supplier> supplier =
                supplierRepository.findByEmail(email);

        if (supplier.isPresent()) {

            return new org.springframework.security.core.userdetails.User(

                    supplier.get().getEmail(),

                    supplier.get().getPassword(),

                    Collections.singletonList(
                            new SimpleGrantedAuthority(
                                    "ROLE_" +
                                            supplier.get().getRole().name()
                            )
                    )
            );
        }


        throw new UsernameNotFoundException(
                "Email not found: " + email
        );
    }
}