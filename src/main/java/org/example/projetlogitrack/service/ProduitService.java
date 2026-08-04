package org.example.projetlogitrack.service;

import org.example.projetlogitrack.dto.ProduitDTO;
import org.example.projetlogitrack.exception.ResourceNotFoundException;
import org.example.projetlogitrack.mapper.ProduitMapper;
import org.example.projetlogitrack.model.Produit;
import org.example.projetlogitrack.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ProduitMapper produitMapper;

    public Page<ProduitDTO> findAll(Pageable pageable) {
        return produitRepository.findAll(pageable).map(produitMapper::toDto);
    }

    public Page<ProduitDTO> findByCategorie(String categorie, Pageable pageable) {
        return produitRepository.findByCategorie(categorie, pageable).map(produitMapper::toDto);
    }

    public Page<ProduitDTO> findByPrix(double prix, Pageable pageable) {
        return produitRepository.findByPrixLessThan(prix, pageable).map(produitMapper::toDto);
    }

    public Page<ProduitDTO> lowStock(Pageable pageable) {
        return produitRepository.findLowStockPageable(pageable).map(produitMapper::toDto);
    }

    public ProduitDTO findById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id " + id));
        return produitMapper.toDto(produit);
    }

    public ProduitDTO save(ProduitDTO dto) {
        Produit produit = produitRepository.save(produitMapper.toEntity(dto));
        return produitMapper.toDto(produit);
    }

    public ProduitDTO update(Long id, ProduitDTO dto) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id " + id));
        produit.setNom(dto.getNom());
        produit.setCategorie(dto.getCategorie());
        produit.setPrix(dto.getPrix());
        produit.setQuantiteStock(dto.getQuantiteStock());
        return produitMapper.toDto(produitRepository.save(produit));
    }

    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produit introuvable avec l'id " + id);
        }
        produitRepository.deleteById(id);
    }
}
