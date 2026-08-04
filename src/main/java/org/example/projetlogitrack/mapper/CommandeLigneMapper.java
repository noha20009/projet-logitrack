package org.example.projetlogitrack.mapper;

import org.example.projetlogitrack.dto.CommandeLigneDTO;
import org.example.projetlogitrack.model.CommandeLigne;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = ProduitMapper.class)
public interface CommandeLigneMapper {

    CommandeLigneDTO toDto(CommandeLigne ligne);
}
