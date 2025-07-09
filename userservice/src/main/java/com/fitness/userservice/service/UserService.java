package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponce;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService  {

    @Autowired
    private UserRepository repository;

    public UserResponce register(RegisterRequest request) {
        log.info("=== REGISTER METHOD CALLED ===");
        log.info("RegisterRequest received: {}", request);
        log.info("Email: {}", request.getEmail());
        log.info("KeycloakId from request: {}", request.getKeycloakId());
        log.info("FirstName: {}", request.getFirstName());
        log.info("LastName: {}", request.getLastName());

        if(repository.existsByEmail(request.getEmail())){
            log.info("User already exists with email: {}", request.getEmail());
            User existingUser = repository.findByEmail(request.getEmail());
            log.info("Existing user KeycloakId: {}", existingUser.getKeycloakId());

            // If existing user doesn't have keycloakId but request has it, update it
            if (existingUser.getKeycloakId() == null && request.getKeycloakId() != null) {
                log.info("Updating existing user with KeycloakId: {}", request.getKeycloakId());
                existingUser.setKeycloakId(request.getKeycloakId());
                existingUser = repository.save(existingUser);
                log.info("Updated existing user KeycloakId: {}", existingUser.getKeycloakId());
            }

            UserResponce userResponce = new UserResponce();
            userResponce.setId(existingUser.getId());
            userResponce.setPassword(existingUser.getPassword());
            userResponce.setKeycloakId(existingUser.getKeycloakId());
            userResponce.setEmail(existingUser.getEmail());
            userResponce.setFirstName(existingUser.getFirstName());
            userResponce.setLastName(existingUser.getLastName());
            userResponce.setCreatedAt(existingUser.getCreatedAt());
            userResponce.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponce;
        }

        log.info("Creating new user...");
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        log.info("User object before save:");
        log.info("  Email: {}", user.getEmail());
        log.info("  KeycloakId: {}", user.getKeycloakId());
        log.info("  FirstName: {}", user.getFirstName());
        log.info("  LastName: {}", user.getLastName());

        User savedUser = repository.save(user);

        log.info("User object after save:");
        log.info("  ID: {}", savedUser.getId());
        log.info("  Email: {}", savedUser.getEmail());
        log.info("  KeycloakId: {}", savedUser.getKeycloakId());
        log.info("  FirstName: {}", savedUser.getFirstName());
        log.info("  LastName: {}", savedUser.getLastName());

        UserResponce userResponce = new UserResponce();
        userResponce.setId(savedUser.getId());
        userResponce.setKeycloakId(savedUser.getKeycloakId());
        userResponce.setPassword(savedUser.getPassword());
        userResponce.setEmail(savedUser.getEmail());
        userResponce.setFirstName(savedUser.getFirstName());
        userResponce.setLastName(savedUser.getLastName());
        userResponce.setCreatedAt(savedUser.getCreatedAt());
        userResponce.setUpdatedAt(savedUser.getUpdatedAt());

        log.info("UserResponse created with KeycloakId: {}", userResponce.getKeycloakId());
        log.info("=== REGISTER METHOD COMPLETED ===");
        return userResponce;
    }

    public UserResponce getUserProfile(String userId) {
        log.info("Getting user profile for userId: {}", userId);
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponce userResponce = new UserResponce();
        userResponce.setId(user.getId());
        userResponce.setPassword(user.getPassword());
        userResponce.setKeycloakId(user.getKeycloakId());
        userResponce.setEmail(user.getEmail());
        userResponce.setFirstName(user.getFirstName());
        userResponce.setLastName(user.getLastName());
        userResponce.setCreatedAt(user.getCreatedAt());
        userResponce.setUpdatedAt(user.getUpdatedAt());

        return userResponce;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling user validation API for userId: {}", userId);
        boolean exists = repository.existsById(userId);
        log.info("User exists: {}", exists);
        return exists;
    }
}