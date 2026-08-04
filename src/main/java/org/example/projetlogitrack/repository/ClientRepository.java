package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Page<Client> findByNomContainingIgnoreCase(String nom, Pageable pageable);
}
