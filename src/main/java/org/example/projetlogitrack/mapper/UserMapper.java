package org.example.projetlogitrack.mapper;

import org.example.projetlogitrack.dto.UserDTO;
import org.example.projetlogitrack.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDto(User user);
}
