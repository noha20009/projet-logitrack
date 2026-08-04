package org.example.projetlogitrack.mapper;

import org.example.projetlogitrack.dto.CommandeDTO;
import org.example.projetlogitrack.model.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ClientMapper.class, CommandeLigneMapper.class})
public interface CommandeMapper {

    @Mapping(target = "client", source = "client")
    @Mapping(target = "lignes", source = "lignesCommande")
    CommandeDTO toDto(Commande commande);
}
