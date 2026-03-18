package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.CommandeLigne;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeLigneRepository extends JpaRepository<CommandeLigne, Long> {
}