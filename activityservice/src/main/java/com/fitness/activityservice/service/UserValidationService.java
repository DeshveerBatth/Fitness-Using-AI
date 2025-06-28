package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        log.info("Calling user validation API for userId : {}", userId);
        try {
            Boolean result = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            return result != null ? result : false;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.warn("User not found: {}", userId);
                return false;  // Return false instead of throwing exception
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                log.warn("Invalid user ID: {}", userId);
                return false;  // Return false instead of throwing exception
            } else {
                log.error("Error validating user: {}. Status: {}", userId, e.getStatusCode());
                return false;  // Return false for other HTTP errors
            }
        } catch (Exception e) {
            log.error("Unexpected error validating user: {}", userId, e);
            return false;  // Return false for unexpected errors
        }
    }
}