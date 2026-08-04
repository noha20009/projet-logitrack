package org.example.projetlogitrack.service;

import org.example.projetlogitrack.dto.ClientDTO;
import org.example.projetlogitrack.exception.ResourceNotFoundException;
import org.example.projetlogitrack.mapper.ClientMapper;
import org.example.projetlogitrack.model.Client;
import org.example.projetlogitrack.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientMapper clientMapper;

    public Page<ClientDTO> findAll(Pageable pageable) {
        return clientRepository.findAll(pageable).map(clientMapper::toDto);
    }

    public Page<ClientDTO> searchByNom(String nom, Pageable pageable) {
        return clientRepository.findByNomContainingIgnoreCase(nom, pageable).map(clientMapper::toDto);
    }

    public ClientDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id " + id));
        return clientMapper.toDto(client);
    }

    public ClientDTO save(ClientDTO dto) {
        Client client = clientRepository.save(clientMapper.toEntity(dto));
        return clientMapper.toDto(client);
    }

    public ClientDTO update(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id " + id));
        client.setNom(dto.getNom());
        client.setEmail(dto.getEmail());
        client.setTelephone(dto.getTelephone());
        client.setVille(dto.getVille());
        return clientMapper.toDto(clientRepository.save(client));
    }

    public void delete(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client introuvable avec l'id " + id);
        }
        clientRepository.deleteById(id);
    }
}
