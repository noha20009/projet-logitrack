package org.example.projetlogitrack.controller;


import org.example.projetlogitrack.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.projetlogitrack.repository.ClientRepository;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;


    @PostMapping
    public Client addClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }


    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }


    @GetMapping("/{ida}")
    public Client getClient(@PathVariable Long id) {
        return clientRepository.findById(id).orElse(null);
    }


    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }
}