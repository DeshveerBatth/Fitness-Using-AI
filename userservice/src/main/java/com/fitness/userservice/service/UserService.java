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

        if(repository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        UserResponce userResponce = new UserResponce();
        userResponce.setId(savedUser.getId());
        userResponce.setPassword(savedUser.getPassword());
        userResponce.setEmail(savedUser.getEmail());
        userResponce.setFirstName(savedUser.getFirstName());
        userResponce.setLastName(savedUser.getLastName());
        userResponce.setCreatedAt(savedUser.getCreatedAt());
        userResponce.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponce;

    }

    public UserResponce getUserProfile(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponce userResponce = new UserResponce();
        userResponce.setId(user.getId());
        userResponce.setPassword(user.getPassword());
        userResponce.setEmail(user.getEmail());
        userResponce.setFirstName(user.getFirstName());
        userResponce.setLastName(user.getLastName());
        userResponce.setCreatedAt(user.getCreatedAt());
        userResponce.setUpdatedAt(user.getUpdatedAt());

        return userResponce;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling user validation API for userId : {}", userId);
        return repository.existsById(userId);
    }
}
