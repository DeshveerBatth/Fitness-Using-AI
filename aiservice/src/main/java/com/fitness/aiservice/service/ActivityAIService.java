package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // Add this method to your ActivityAIService class

    public Mono<String> generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Generated prompt for activity {}: {}", activity.getId(), prompt);

        return Mono.fromCallable(() -> {
                    log.info("Starting AI recommendation generation for activity: {}", activity.getId());
                    long startTime = System.currentTimeMillis();

                    String response = geminiService.getAnswer(prompt);
                    log.info("Received raw response from Gemini for activity {}", activity.getId());

                    String parsedResponse = parseGeminiResponse(response);
                    log.info("Parsed Gemini response for activity {}", activity.getId());

                    String structuredResponse = createStructuredResponse(parsedResponse);

                    long endTime = System.currentTimeMillis();
                    log.info("Total recommendation generation time for activity {}: {} ms",
                            activity.getId(), (endTime - startTime));
                    processAiResponce(activity, response);
                    return structuredResponse;
                })
                .doOnSuccess(response -> log.info("Successfully generated recommendation for activity {}: {}",
                        activity.getId(), response))
                .doOnError(error -> log.error("Error generating recommendation for activity {}: {}",
                        activity.getId(), error.getMessage(), error));
    }

    private void processAiResponce(Activity activity, String aiResponce){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponce);

            JsonNode testNode = rootNode.path("candidates")
                    .get(0)
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format(
                """
                        Based on the following fitness activity data, provide recommendations in JSON format:
                        
                        Activity Details:
                        - Type: %s
                        - Duration: %d minutes
                        - Calories Burned: %d
                        - Start Time: %s
                        - Additional Metrics: %s
                        
                        Please respond with ONLY a JSON object in this exact format:
                        {
                          "performanceAnalysis": "your analysis here",
                          "improvementSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
                          "recommendedActivities": ["activity1", "activity2"],
                          "tips": ["tip1", "tip2", "tip3"],
                          "motivationalMessage": "encouraging message here"
                        }
                        
                        Do not include any text outside the JSON object.""",
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

            if (candidates != null && candidates.isArray() && !candidates.isEmpty()) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && !parts.isEmpty()) {
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
            // If AI returned proper JSON, pretty-print it
            JsonNode jsonNode = objectMapper.readTree(aiContent);
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode);
        } catch (Exception e) {
            log.warn("AI response was not valid JSON, creating structured response");

            Map<String, Object> structuredResponse = Map.of(
                    "success", false,
                    "rawResponse", aiContent,
                    "error", "AI response was not in expected JSON format",
                    "fallbackRecommendation", "Continue your fitness journey! Focus on consistency and gradual improvement."
            );

            try {
                return objectMapper.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(structuredResponse);
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
            String response = geminiService.getAnswer(prompt);
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