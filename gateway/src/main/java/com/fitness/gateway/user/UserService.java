package com.fitness.gateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling user validation API for userId: {}", userId);

        return userServiceWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        log.warn("User not found: {}", userId);
                        return Mono.just(false);
                    } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        log.warn("Invalid user ID: {}", userId);
                        return Mono.just(false);
                    } else {
                        log.error("Error validating user: {}. Status: {}", userId, e.getStatusCode());
                        return Mono.just(false);
                    }
                })
                .defaultIfEmpty(false);
    }

    public Mono<UserResponce> registerUser(RegisterRequest request) {
        log.info("Calling user registration API for email: {}", request.getEmail());

        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UserResponce.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        log.warn("Bad request for user registration: {}", request.getEmail());
                        return Mono.error(new RuntimeException("Registration failed: Bad request"));
                    } else if (e.getStatusCode() == HttpStatus.CONFLICT) {
                        log.warn("User already exists: {}", request.getEmail());
                        return Mono.error(new RuntimeException("User already exists"));
                    } else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                        log.error("Internal server error during registration: {}", request.getEmail());
                        return Mono.error(new RuntimeException("Registration failed: Internal server error"));
                    } else {
                        log.error("Error registering user: {}. Status: {}", request.getEmail(), e.getStatusCode());
                        return Mono.error(new RuntimeException("Registration failed"));
                    }
                });
    }
}