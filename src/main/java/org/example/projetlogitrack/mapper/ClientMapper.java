package org.example.projetlogitrack.mapper;

import org.example.projetlogitrack.dto.ClientDTO;
import org.example.projetlogitrack.model.Client;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    ClientDTO toDto(Client client);

    Client toEntity(ClientDTO dto);
}
