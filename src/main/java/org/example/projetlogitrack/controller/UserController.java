package org.example.projetlogitrack.controller;

import org.example.projetlogitrack.model.Role;
import org.example.projetlogitrack.model.User;
import org.example.projetlogitrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestParam Role role) {
        return userService.updateRole(id, role);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}