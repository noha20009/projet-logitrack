package org.example.projetlogitrack.service;

import org.example.projetlogitrack.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.projetlogitrack.repository.ProduitRepository;

import java.util.List;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    public Produit save(Produit produit) {
        return produitRepository.save(produit);
    }

    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    public Produit findById(Long id) {
        return produitRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        produitRepository.deleteById(id);
    }

    // Derived Query
    public List<Produit> findByCategorie(String categorie) {
        return produitRepository.findByCategorie(categorie);
    }

    public List<Produit> findByPrix(double prix) {
        return produitRepository.findByPrixLessThan(prix);
    }

    // @Query
    public List<Produit> lowStock() {
        return produitRepository.findLowStockProducts();
    }
}