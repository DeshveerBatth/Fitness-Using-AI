package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {
    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .build();
    }

    public String getAnswer(String question) {
        log.info("Starting Gemini API call...");
        long startTime = System.currentTimeMillis();

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", question)
                            })
                    }
            );

            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60)) // 60 second timeout
                    .block();

            long endTime = System.currentTimeMillis();
            log.info("Gemini API call completed in {} ms", (endTime - startTime));
            log.debug("Gemini API response: {}", response);

            return response;

        } catch (WebClientException e) {
            long endTime = System.currentTimeMillis();
            log.error("Gemini API call failed after {} ms: {}", (endTime - startTime), e.getMessage());
            throw new RuntimeException("Failed to get response from Gemini API", e);
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("Unexpected error during Gemini API call after {} ms: {}", (endTime - startTime), e.getMessage());
            throw new RuntimeException("Unexpected error calling Gemini API", e);
        }
    }
}