package com.example.InfosysSpringProject.Repository;




import com.example.InfosysSpringProject.Entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository
        extends JpaRepository<Supplier, Long> {

    // Find supplier using email
    Optional<Supplier> findByEmail(String email);


}
