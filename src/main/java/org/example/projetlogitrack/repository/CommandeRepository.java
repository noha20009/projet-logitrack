package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {

    // 🔹 Derived Query → commandes d’un client
    List<Commande> findByClientId(Long clientId);

    // 🔹 @Query → nombre total de commandes
    @Query("SELECT COUNT(c) FROM Commande c")
    long countCommandes();
}
