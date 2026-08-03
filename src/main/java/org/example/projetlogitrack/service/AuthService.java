package org.example.projetlogitrack.service;

import org.example.projetlogitrack.dto.AuthResponse;
import org.example.projetlogitrack.dto.LoginRequest;
import org.example.projetlogitrack.dto.RegisterRequest;
import org.example.projetlogitrack.model.Role;
import org.example.projetlogitrack.model.User;
import org.example.projetlogitrack.repository.UserRepository;
import org.example.projetlogitrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private org.example.projetlogitrack.security.CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
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

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getNom(), user.getPrenom(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Email ou mot de passe incorrect.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect."));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getNom(), user.getPrenom(), user.getEmail(), user.getRole().name());
    }
}