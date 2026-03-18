package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}