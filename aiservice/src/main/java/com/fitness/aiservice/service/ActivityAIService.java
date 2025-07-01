package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public Mono<String> generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Generated prompt for activity {}: {}", activity.getId(), prompt);

        return geminiService.getAnswer(prompt)
                .map(this::parseGeminiResponse)
                .map(this::createStructuredResponse)
                .doOnSuccess(response -> log.info("Structured response for activity {}: {}", activity.getId(), response))
                .doOnError(error -> log.error("Error getting AI response for activity {}: {}", activity.getId(), error.getMessage()));
    }

    private String createPromptForActivity(Activity activity) {
        return String.format(
                "Based on the following fitness activity data, provide recommendations in JSON format:\n\n" +
                        "Activity Details:\n" +
                        "- Type: %s\n" +
                        "- Duration: %d minutes\n" +
                        "- Calories Burned: %d\n" +
                        "- Start Time: %s\n" +
                        "- Additional Metrics: %s\n\n" +
                        "Please respond with ONLY a JSON object in this exact format:\n" +
                        "{\n" +
                        "  \"performanceAnalysis\": \"your analysis here\",\n" +
                        "  \"improvementSuggestions\": [\"suggestion1\", \"suggestion2\", \"suggestion3\"],\n" +
                        "  \"recommendedActivities\": [\"activity1\", \"activity2\"],\n" +
                        "  \"tips\": [\"tip1\", \"tip2\", \"tip3\"],\n" +
                        "  \"motivationalMessage\": \"encouraging message here\"\n" +
                        "}\n\n" +
                        "Do not include any text outside the JSON object.",
                activity.getType() != null ? activity.getType().toString() : "Unknown",
                activity.getDuration() != null ? activity.getDuration() : 0,
                activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0,
                activity.getStartTime() != null ? activity.getStartTime().toString() : "Not specified",
                activity.getAdditionalMatrices() != null ? activity.getAdditionalMatrices().toString() : "None"
        );
    }

    private String parseGeminiResponse(String geminiResponse) {
        try {
            // Parse the Gemini API response to extract the actual content
            JsonNode responseNode = objectMapper.readTree(geminiResponse);
            JsonNode candidates = responseNode.get("candidates");

            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        return parts.get(0).get("text").asText();
                    }
                }
            }

            // Fallback: return the original response if parsing fails
            return geminiResponse;
        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage());
            return geminiResponse;
        }
    }

    private String createStructuredResponse(String aiContent) {
        try {
            // Try to parse as JSON first (if AI returned proper JSON)
            JsonNode jsonNode = objectMapper.readTree(aiContent);
            return objectMapper.writeValueAsString(jsonNode);
        } catch (Exception e) {
            // If AI didn't return JSON, create a structured response
            log.warn("AI response was not valid JSON, creating structured response");

            Map<String, Object> structuredResponse = Map.of(
                    "success", false,
                    "rawResponse", aiContent,
                    "error", "AI response was not in expected JSON format",
                    "fallbackRecommendation", "Continue your fitness journey! Focus on consistency and gradual improvement."
            );

            try {
                return objectMapper.writeValueAsString(structuredResponse);
            } catch (Exception jsonError) {
                log.error("Error creating fallback JSON: {}", jsonError.getMessage());
                return "{\"success\":false,\"error\":\"Unable to process recommendation\"}";
            }
        }
    }

    // Alternative method if you need synchronous response (blocking)
    public String generateRecommendationSync(Activity activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Generated prompt for activity {}: {}", activity.getId(), prompt);

        try {
            String response = geminiService.getAnswer(prompt).block();
            String parsedResponse = parseGeminiResponse(response);
            String structuredResponse = createStructuredResponse(parsedResponse);
            log.info("Response from AI for activity {}: {}", activity.getId(), structuredResponse);
            return structuredResponse;
        } catch (Exception e) {
            log.error("Error getting AI response for activity {}: {}", activity.getId(), e.getMessage());
            return "Unable to generate recommendations at this time. Please try again later.";
        }
    }
}