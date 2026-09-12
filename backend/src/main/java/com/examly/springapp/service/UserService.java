package com.examly.springapp.service;

import com.examly.springapp.dto.UserProfileResponse;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.model.Role;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));
        return new UserProfileResponse(user);
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserProfileResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (role != null) {
            user.setRole(role);
        }
        User updatedUser = userRepository.save(user);
        return new UserProfileResponse(updatedUser);
    }

    @Transactional
    public UserProfileResponse updateUserProfile(String email, UserProfileResponse updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));

        if (updateDto.getFullName() != null) {
            if (!updateDto.getFullName().matches("^[a-zA-Z\\s]+$")) {
                throw new InvalidNameException("Drug name must not contain special characters or numbers");
            }
            user.setFullName(updateDto.getFullName().trim());
        }

        if (updateDto.getMobile() != null) {
            if (!updateDto.getMobile().matches("^\\d{10}$")) {
                throw new InvalidPhoneException("Phone Number must be exactly 10 digits long");
            }
            user.setMobile(updateDto.getMobile().trim());
        }

        if (updateDto.getLicenceNumber() != null) {
            user.setLicenceNumber(updateDto.getLicenceNumber());
        }

        if (updateDto.getEmployeeId() != null) {
            user.setEmployeeId(updateDto.getEmployeeId());
        }

        User updatedUser = userRepository.save(user);
        return new UserProfileResponse(updatedUser);
    }
}
