package com.examly.springapp.controller;

import com.examly.springapp.dto.UserProfileResponse;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.examly.springapp.model.Role;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Map;

@Tag(name = "User Profile", description = "Endpoints for fetching and updating logged-in user profile")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileResponse profile = userService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(Authentication authentication,
                                                              @RequestBody UserProfileResponse updateDto) {
        String email = authentication.getName();
        UserProfileResponse updatedProfile = userService.updateUserProfile(email, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}
