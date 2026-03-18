package org.example.projetlogitrack.service;

import org.example.projetlogitrack.model.*;
import org.example.projetlogitrack.repository.ClientRepository;
import org.example.projetlogitrack.repository.CommandeLigneRepository;
import org.example.projetlogitrack.repository.CommandeRepository;
import org.example.projetlogitrack.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CommandeLigneRepository ligneRepository;


    public Commande createCommande(Long clientId) {
        Client client = clientRepository.findById(clientId).orElse(null);

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setDateCommande(LocalDate.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);

        return commandeRepository.save(commande);
    }


    public CommandeLigne addProduit(Long orderId, Long produitId, int quantite) {
        Commande commande = commandeRepository.findById(orderId).orElse(null);
        Produit produit = produitRepository.findById(produitId).orElse(null);

        CommandeLigne ligne = new CommandeLigne();
        ligne.setCommande(commande);
        ligne.setProduit(produit);
        ligne.setQuantite(quantite);

        return ligneRepository.save(ligne);
    }

    public List<Commande> findAll() {
        return commandeRepository.findAll();
    }

    public Commande findById(Long id) {
        return commandeRepository.findById(id).orElse(null);
    }


    public Commande updateStatus(Long id, String status) {
        Commande commande = commandeRepository.findById(id).orElse(null);
        commande.setStatut(StatutCommande.valueOf(status));
        return commandeRepository.save(commande);
    }


    public List<Commande> findByClient(Long clientId) {
        return commandeRepository.findByClientId(clientId);
    }


    public long count() {
        return commandeRepository.countCommandes();
    }
}
