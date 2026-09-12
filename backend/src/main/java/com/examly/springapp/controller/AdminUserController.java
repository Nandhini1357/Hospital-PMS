package com.examly.springapp.controller;

import com.examly.springapp.dto.UserProfileResponse;
import com.examly.springapp.model.Role;
import com.examly.springapp.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Admin User Management", description = "Administrator endpoints for inspecting and updating user roles")
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserProfileResponse> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        Role newRole = Role.valueOf(roleStr);
        UserProfileResponse updated = userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(updated);
    }
}
