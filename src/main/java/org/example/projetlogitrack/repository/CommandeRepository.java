package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.Commande;
import org.example.projetlogitrack.model.StatutCommande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {

    // 🔹 Derived Query → commandes d’un client
    List<Commande> findByClientId(Long clientId);

    Page<Commande> findByClientId(Long clientId, Pageable pageable);

    // 🔹 Derived Query → commandes par statut
    Page<Commande> findByStatut(StatutCommande statut, Pageable pageable);

    // 🔹 Commandes récentes pour le tableau de bord
    List<Commande> findTop5ByOrderByDateCommandeDesc();

    // 🔹 @Query → nombre total de commandes
    @Query("SELECT COUNT(c) FROM Commande c")
    long countCommandes();
}
