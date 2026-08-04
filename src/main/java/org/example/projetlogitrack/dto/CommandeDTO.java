package org.example.projetlogitrack.dto;

import org.example.projetlogitrack.model.StatutCommande;

import java.time.LocalDate;
import java.util.List;

public class CommandeDTO {

    private Long id;
    private LocalDate dateCommande;
    private StatutCommande statut;
    private ClientDTO client;
    private List<CommandeLigneDTO> lignes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDate dateCommande) {
        this.dateCommande = dateCommande;
    }

    public StatutCommande getStatut() {
        return statut;
    }

    public void setStatut(StatutCommande statut) {
        this.statut = statut;
    }

    public ClientDTO getClient() {
        return client;
    }

    public void setClient(ClientDTO client) {
        this.client = client;
    }

    public List<CommandeLigneDTO> getLignes() {
        return lignes;
    }

    public void setLignes(List<CommandeLigneDTO> lignes) {
        this.lignes = lignes;
    }
}
