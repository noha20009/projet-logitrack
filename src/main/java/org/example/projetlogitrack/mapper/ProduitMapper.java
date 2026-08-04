package org.example.projetlogitrack.mapper;

import org.example.projetlogitrack.dto.ProduitDTO;
import org.example.projetlogitrack.model.Produit;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProduitMapper {

    ProduitDTO toDto(Produit produit);

    Produit toEntity(ProduitDTO dto);
}
