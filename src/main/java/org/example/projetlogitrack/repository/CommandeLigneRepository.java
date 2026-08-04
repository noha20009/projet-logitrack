package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.CommandeLigne;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommandeLigneRepository extends JpaRepository<CommandeLigne, Long> {

    // 🔹 Produit le plus commandé (quantité totale commandée, décroissant)
    @Query("SELECT l.produit.id, l.produit.nom, SUM(l.quantite) AS total " +
            "FROM CommandeLigne l GROUP BY l.produit.id, l.produit.nom " +
            "ORDER BY SUM(l.quantite) DESC")
    List<Object[]> findMostOrderedProducts(Pageable pageable);
}
