package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // Reactive method that returns Recommendation object
    public Mono<Recommendation> generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Generated prompt for activity {}: {}", activity.getId(), prompt);

        return Mono.fromCallable(() -> {
                    log.info("Starting AI recommendation generation for activity: {}", activity.getId());
                    long startTime = System.currentTimeMillis();

                    String response = geminiService.getAnswer(prompt);
                    log.info("Received raw response from Gemini for activity {}", activity.getId());

                    Recommendation recommendation = processAiResponse(activity, response);

                    long endTime = System.currentTimeMillis();
                    log.info("Total recommendation generation time for activity {}: {} ms",
                            activity.getId(), (endTime - startTime));

                    return recommendation;
                })
                .doOnSuccess(recommendation -> log.info("Successfully generated recommendation for activity {}: {}",
                        activity.getId(), recommendation.getRecommendation()))
                .doOnError(error -> log.error("Error generating recommendation for activity {}: {}",
                        activity.getId(), error.getMessage(), error));
    }

    // Synchronous method that returns Recommendation object
    public Recommendation generateRecommendationSync(Activity activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Generated prompt for activity {}: {}", activity.getId(), prompt);

        try {
            String response = geminiService.getAnswer(prompt);
            Recommendation recommendation = processAiResponse(activity, response);
            log.info("Successfully generated recommendation for activity {}: {}",
                    activity.getId(), recommendation.getRecommendation());
            return recommendation;
        } catch (Exception e) {
            log.error("Error getting AI response for activity {}: {}", activity.getId(), e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    // Method that returns structured JSON string (for API responses)
    public Mono<String> generateRecommendationJson(Activity activity) {
        return generateRecommendation(activity)
                .map(this::convertRecommendationToJson)
                .onErrorReturn(createErrorJson());
    }

    // Synchronous method that returns JSON string
    public String generateRecommendationJsonSync(Activity activity) {
        try {
            Recommendation recommendation = generateRecommendationSync(activity);
            return convertRecommendationToJson(recommendation);
        } catch (Exception e) {
            log.error("Error generating JSON recommendation for activity {}: {}", activity.getId(), e.getMessage());
            return createErrorJson();
        }
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            log.info("PARSED RESPONSE FROM AI: {}", jsonContent);

            JsonNode analysisJson = objectMapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace: ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate: ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories: ");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType() != null ? activity.getType().toString() : "Unknown") // Fixed
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error processing AI response for activity {}: {}", activity.getId(), e.getMessage(), e);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType() != null ? activity.getType().toString() : "Unknown") // Fixed
                .recommendation("Unable to generate detailed analysis. Please try again later.")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body and stop if you feel pain"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private String convertRecommendationToJson(Recommendation recommendation) {
        try {
            Map<String, Object> response = Map.of(
                    "success", true,
                    "activityId", recommendation.getActivityId(),
                    "userId", recommendation.getUserId(),
                    "activityType", recommendation.getActivityType(), // Fixed: removed .toString()
                    "analysis", recommendation.getRecommendation(),
                    "improvements", recommendation.getImprovements(),
                    "suggestions", recommendation.getSuggestions(),
                    "safety", recommendation.getSafety(),
                    "createdAt", recommendation.getCreatedAt().toString()
            );
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);
        } catch (Exception e) {
            log.error("Error converting recommendation to JSON: {}", e.getMessage());
            return createErrorJson();
        }
    }

    private String createErrorJson() {
        return "{\"success\":false,\"error\":\"Unable to generate recommendation\",\"fallbackMessage\":\"Continue your fitness journey! Focus on consistency and gradual improvement.\"}";
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                Arrays.asList("Follow general safety guidelines", "Stay hydrated", "Listen to your body") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
                {
                  "analysis": {
                    "overall": "Overall analysis here",
                    "pace": "Pace analysis here",
                    "heartRate": "Heart rate analysis here",
                    "caloriesBurned": "Calories analysis here"
                  },
                  "improvements": [
                    {
                      "area": "Area name",
                      "recommendation": "Detailed recommendation"
                    }
                  ],
                  "suggestions": [
                    {
                      "workout": "Workout name",
                      "description": "Detailed workout description"
                    }
                  ],
                  "safety": [
                    "Safety point 1",
                    "Safety point 2"
                  ]
                }

                Analyze this activity:
                Activity Type: %s
                Duration: %d minutes
                Calories Burned: %d
                Start Time: %s
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
                Ensure the response follows the EXACT JSON format shown above.
                """,
                activity.getType() != null ? activity.getType().toString() : "Unknown",
                activity.getDuration() != null ? activity.getDuration() : 0,
                activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0,
                activity.getStartTime() != null ? activity.getStartTime().toString() : "Not specified",
                activity.getAdditionalMatrices() != null ? activity.getAdditionalMatrices().toString() : "None"
        );
    }
}
