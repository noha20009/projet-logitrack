package org.example.projetlogitrack.controller;


import org.example.projetlogitrack.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.example.projetlogitrack.repository.ClientRepository;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Client addClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    public Client getClient(@PathVariable Long id) {
        return clientRepository.findById(id).orElse(null);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Client updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        return clientRepository.findById(id).map(client -> {
            client.setNom(updatedClient.getNom());
            client.setEmail(updatedClient.getEmail());
            client.setTelephone(updatedClient.getTelephone());
            client.setVille(updatedClient.getVille());
            return clientRepository.save(client);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }
}