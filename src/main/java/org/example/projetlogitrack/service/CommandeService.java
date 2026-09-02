package org.example.projetlogitrack.service;

import org.example.projetlogitrack.client.NotificationClient;
import org.example.projetlogitrack.dto.CommandeDTO;
import org.example.projetlogitrack.dto.CommandeLigneDTO;
import org.example.projetlogitrack.dto.NotificationRequest;
import org.example.projetlogitrack.exception.ResourceNotFoundException;
import org.example.projetlogitrack.mapper.CommandeLigneMapper;
import org.example.projetlogitrack.mapper.CommandeMapper;
import org.example.projetlogitrack.model.*;
import org.example.projetlogitrack.repository.ClientRepository;
import org.example.projetlogitrack.repository.CommandeLigneRepository;
import org.example.projetlogitrack.repository.CommandeRepository;
import org.example.projetlogitrack.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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

    @Autowired
    private CommandeMapper commandeMapper;

    @Autowired
    private CommandeLigneMapper commandeLigneMapper;

    @Autowired
    private NotificationClient notificationClient;

    public Page<CommandeDTO> findAll(String statut, Pageable pageable) {
        if (statut != null && !statut.isBlank()) {
            return commandeRepository.findByStatut(parseStatut(statut), pageable).map(commandeMapper::toDto);
        }
        return commandeRepository.findAll(pageable).map(commandeMapper::toDto);
    }

    public CommandeDTO findById(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec l'id " + id));
        return commandeMapper.toDto(commande);
    }

    public Page<CommandeDTO> findByClient(Long clientId, Pageable pageable) {
        return commandeRepository.findByClientId(clientId, pageable).map(commandeMapper::toDto);
    }

    public CommandeDTO createCommande(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id " + clientId));

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setDateCommande(LocalDate.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);

        Commande saved = commandeRepository.save(commande);

        notificationClient.createNotification(new NotificationRequest(
                saved.getId(),
                "ORDER_CREATED",
                "La commande " + saved.getId() + " a été créée pour le client " + client.getId() + "."
        ));

        return commandeMapper.toDto(saved);
    }

    public CommandeLigneDTO addProduit(Long orderId, Long produitId, int quantite) {
        if (quantite <= 0) {
            throw new IllegalArgumentException("La quantité doit être supérieure à 0.");
        }

        Commande commande = commandeRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec l'id " + orderId));
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id " + produitId));

        CommandeLigne ligne = new CommandeLigne();
        ligne.setCommande(commande);
        ligne.setProduit(produit);
        ligne.setQuantite(quantite);

        return commandeLigneMapper.toDto(ligneRepository.save(ligne));
    }

    public CommandeDTO updateStatus(Long id, String status) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable avec l'id " + id));
        StatutCommande newStatus = parseStatut(status);
        commande.setStatut(newStatus);
        CommandeDTO dto = commandeMapper.toDto(commandeRepository.save(commande));

        switch (newStatus) {
            case EXPEDIEE -> notificationClient.createNotification(new NotificationRequest(
                    id, "ORDER_SHIPPED", "La commande " + id + " a été expédiée."));
            case LIVREE -> notificationClient.createNotification(new NotificationRequest(
                    id, "ORDER_DELIVERED", "La commande " + id + " a été livrée."));
            default -> { }
        }

        return dto;
    }

    public long count() {
        return commandeRepository.countCommandes();
    }

    public void delete(Long id) {
        if (!commandeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Commande introuvable avec l'id " + id);
        }
        commandeRepository.deleteById(id);
    }

    private StatutCommande parseStatut(String status) {
        try {
            return StatutCommande.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide : " + status
                    + " (valeurs acceptées : EN_ATTENTE, EXPEDIEE, LIVREE)");
        }
    }
}
