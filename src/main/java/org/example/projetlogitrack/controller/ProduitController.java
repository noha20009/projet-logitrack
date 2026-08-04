package org.example.projetlogitrack.controller;

import org.example.projetlogitrack.dto.ProduitDTO;
import org.example.projetlogitrack.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Page<ProduitDTO> getAllProduits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nom") String sort) {
        return produitService.findAll(PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Page<ProduitDTO> getByCategorie(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nom") String sort) {
        return produitService.findByCategorie(category, PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/price/{price}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Page<ProduitDTO> getByPrix(
            @PathVariable double price,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prix") String sort) {
        return produitService.findByPrix(price, PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Page<ProduitDTO> lowStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "quantiteStock") String sort) {
        return produitService.lowStock(PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public ProduitDTO getProduit(@PathVariable Long id) {
        return produitService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ProduitDTO addProduit(@RequestBody ProduitDTO produitDTO) {
        return produitService.save(produitDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ProduitDTO updateProduit(@PathVariable Long id, @RequestBody ProduitDTO produitDTO) {
        return produitService.update(id, produitDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduit(@PathVariable Long id) {
        produitService.delete(id);
    }
}
