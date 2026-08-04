package org.example.projetlogitrack.controller;

import org.example.projetlogitrack.model.StatutCommande;
import org.example.projetlogitrack.repository.ClientRepository;
import org.example.projetlogitrack.repository.CommandeRepository;
import org.example.projetlogitrack.repository.ProduitRepository;
import org.example.projetlogitrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class StatsController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalClients = clientRepository.count();
        long totalProduits = produitRepository.count();
        long totalCommandes = commandeRepository.count();
        long totalUsers = userRepository.count();

        long lowStockCount = produitRepository.findLowStockProducts().size();

        var commandes = commandeRepository.findAll();
        long pendingOrders = commandes.stream().filter(c -> c.getStatut() == StatutCommande.EN_ATTENTE).count();
        long inProgressOrders = commandes.stream().filter(c -> c.getStatut() == StatutCommande.EN_COURS).count();
        long shippedOrders = commandes.stream().filter(c -> c.getStatut() == StatutCommande.EXPEDIEE).count();
        long deliveredOrders = commandes.stream().filter(c -> c.getStatut() == StatutCommande.LIVREE).count();

        stats.put("totalClients", totalClients);
        stats.put("totalProduits", totalProduits);
        stats.put("totalCommandes", totalCommandes);
        stats.put("totalUsers", totalUsers);
        stats.put("lowStockCount", lowStockCount);
        stats.put("pendingOrders", pendingOrders);
        stats.put("inProgressOrders", inProgressOrders);
        stats.put("shippedOrders", shippedOrders);
        stats.put("deliveredOrders", deliveredOrders);

        return stats;
    }
}
