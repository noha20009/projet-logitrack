package repository;

import model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {

    // 🔹 Derived Query
    List<Produit> findByCategorie(String categorie);

    List<Produit> findByPrixLessThan(double prix);

    // 🔹 @Query → produits avec stock faible
    @Query("SELECT p FROM Produit p WHERE p.quantiteStock < 5")
    List<Produit> findLowStockProducts();
}