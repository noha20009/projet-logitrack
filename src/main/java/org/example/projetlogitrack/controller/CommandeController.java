package org.example.projetlogitrack.controller;

import org.example.projetlogitrack.dto.CommandeDTO;
import org.example.projetlogitrack.dto.CommandeLigneDTO;
import org.example.projetlogitrack.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Page<CommandeDTO> getAll(
            @RequestParam(required = false) String statut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCommande") String sort) {
        return commandeService.findAll(statut, PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Page<CommandeDTO> getByClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCommande") String sort) {
        return commandeService.findByClient(clientId, PageRequest.of(page, size, Sort.by(sort)));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public long count() {
        return commandeService.count();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public CommandeDTO getOne(@PathVariable Long id) {
        return commandeService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public CommandeDTO createCommande(@RequestParam Long clientId) {
        return commandeService.createCommande(clientId);
    }

    @PostMapping("/{orderId}/products")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @ResponseStatus(HttpStatus.CREATED)
    public CommandeLigneDTO addProduitToCommande(
            @PathVariable Long orderId,
            @RequestParam Long produitId,
            @RequestParam int quantite) {
        return commandeService.addProduit(orderId, produitId, quantite);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public CommandeDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return commandeService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCommande(@PathVariable Long id) {
        commandeService.delete(id);
    }
}
