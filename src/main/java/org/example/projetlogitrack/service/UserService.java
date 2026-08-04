package org.example.projetlogitrack.service;

import org.example.projetlogitrack.dto.RegisterRequest;
import org.example.projetlogitrack.dto.UserDTO;
import org.example.projetlogitrack.exception.ResourceNotFoundException;
import org.example.projetlogitrack.mapper.UserMapper;
import org.example.projetlogitrack.model.Role;
import org.example.projetlogitrack.model.User;
import org.example.projetlogitrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id " + id));
        return userMapper.toDto(user);
    }

    public UserDTO create(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà.");
        }
        Role role = request.getRole() != null ? request.getRole() : Role.AGENT;
        User user = new User(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        return userMapper.toDto(userRepository.save(user));
    }

    public UserDTO updateRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id " + id));
        user.setRole(role);
        return userMapper.toDto(userRepository.save(user));
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur introuvable avec l'id " + id);
        }
        userRepository.deleteById(id);
    }
}
