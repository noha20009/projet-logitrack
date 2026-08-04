package org.example.projetlogitrack.controller;



import org.example.projetlogitrack.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.example.projetlogitrack.repository.ProduitRepository;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Produit addProduit(@RequestBody Produit produit) {
        return produitRepository.save(produit);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Produit getProduit(@PathVariable Long id) {
        return produitRepository.findById(id).orElse(null);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Produit updateProduit(@PathVariable Long id, @RequestBody Produit updatedProduit) {
        return produitRepository.findById(id).map(produit -> {
            produit.setNom(updatedProduit.getNom());
            produit.setCategorie(updatedProduit.getCategorie());
            produit.setPrix(updatedProduit.getPrix());
            produit.setQuantiteStock(updatedProduit.getQuantiteStock());
            return produitRepository.save(produit);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduit(@PathVariable Long id) {
        produitRepository.deleteById(id);
    }


    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public List<Produit> getByCategorie(@PathVariable String category) {
        return produitRepository.findByCategorie(category);
    }


    @GetMapping("/price/{price}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public List<Produit> getByPrix(@PathVariable double price) {
        return produitRepository.findByPrixLessThan(price);
    }


    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public List<Produit> lowStock() {
        return produitRepository.findLowStockProducts();
    }
}