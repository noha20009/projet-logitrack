package org.example.projetlogitrack.controller;



import org.example.projetlogitrack.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.projetlogitrack.repository.ProduitRepository;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;


    @PostMapping
    public Produit addProduit(@RequestBody Produit produit) {
        return produitRepository.save(produit);
    }


    @GetMapping
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }


    @GetMapping("/{id}")
    public Produit getProduit(@PathVariable Long id) {
        return produitRepository.findById(id).orElse(null);
    }


    @DeleteMapping("/{id}")
    public void deleteProduit(@PathVariable Long id) {
        produitRepository.deleteById(id);
    }


    @GetMapping("/category/{category}")
    public List<Produit> getByCategorie(@PathVariable String category) {
        return produitRepository.findByCategorie(category);
    }


    @GetMapping("/price/{price}")
    public List<Produit> getByPrix(@PathVariable double price) {
        return produitRepository.findByPrixLessThan(price);
    }


    @GetMapping("/low-stock")
    public List<Produit> lowStock() {
        return produitRepository.findLowStockProducts();
    }
}
