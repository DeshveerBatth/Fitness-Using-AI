package com.fitness.gateway.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponce {
    private String id;
    private String keycloakId;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
