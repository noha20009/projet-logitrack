package org.example.projetlogitrack.repository;

import org.example.projetlogitrack.model.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {

    // 🔹 Derived Query → produits par catégorie
    List<Produit> findByCategorie(String categorie);

    Page<Produit> findByCategorie(String categorie, Pageable pageable);

    // 🔹 Derived Query → produits dont le prix est inférieur à une valeur
    List<Produit> findByPrixLessThan(double prix);

    Page<Produit> findByPrixLessThan(double prix, Pageable pageable);

    // 🔹 @Query → produits avec stock faible
    @Query("SELECT p FROM Produit p WHERE p.quantiteStock < 5")
    List<Produit> findLowStockProducts();

    @Query("SELECT p FROM Produit p WHERE p.quantiteStock < 5")
    Page<Produit> findLowStockPageable(Pageable pageable);


}
