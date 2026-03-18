package org.example.projetlogitrack.controller;


import org.example.projetlogitrack.model.*;
import org.example.projetlogitrack.repository.ClientRepository;
import org.example.projetlogitrack.repository.CommandeLigneRepository;
import org.example.projetlogitrack.repository.CommandeRepository;
import org.example.projetlogitrack.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CommandeLigneRepository ligneRepository;


    @PostMapping
    public Commande createCommande(@RequestParam Long clientId) {
        Client client = clientRepository.findById(clientId).orElse(null);

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setDateCommande(LocalDate.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);

        return commandeRepository.save(commande);
    }


    @PostMapping("/{orderId}/products")
    public CommandeLigne addProduitToCommande(
            @PathVariable Long orderId,
            @RequestParam Long produitId,
            @RequestParam int quantite) {

        Commande commande = commandeRepository.findById(orderId).orElse(null);
        Produit produit = produitRepository.findById(produitId).orElse(null);

        CommandeLigne ligne = new CommandeLigne();
        ligne.setCommande(commande);
        ligne.setProduit(produit);
        ligne.setQuantite(quantite);

        return ligneRepository.save(ligne);
    }


    @GetMapping
    public List<Commande> getAll() {
        return commandeRepository.findAll();
    }


    @GetMapping("/{id}")
    public Commande getOne(@PathVariable Long id) {
        return commandeRepository.findById(id).orElse(null);
    }


    @PutMapping("/{id}/status")
    public Commande updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Commande commande = commandeRepository.findById(id).orElse(null);
        commande.setStatut(StatutCommande.valueOf(status));

        return commandeRepository.save(commande);
    }


    @GetMapping("/client/{clientId}")
    public List<Commande> getByClient(@PathVariable Long clientId) {
        return commandeRepository.findByClientId(clientId);
    }


    @GetMapping("/count")
    public long count() {
        return commandeRepository.countCommandes();
    }
}