package org.example.projetlogitrack.controller;

import org.example.projetlogitrack.dto.RegisterRequest;
import org.example.projetlogitrack.dto.UserDTO;
import org.example.projetlogitrack.model.Role;
import org.example.projetlogitrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// All endpoints here are restricted to ADMIN, both at the SecurityConfig level
// (/api/users/**) and again here with @PreAuthorize for defense in depth.
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserDTO getOne(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO create(@RequestBody RegisterRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}/role")
    public UserDTO updateRole(@PathVariable Long id, @RequestParam Role role) {
        return userService.updateRole(id, role);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
