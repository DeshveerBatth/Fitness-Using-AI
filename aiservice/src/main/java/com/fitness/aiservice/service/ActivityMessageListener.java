package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {
    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());

        try {
            // Generate recommendation
            Recommendation recommendation = aiService.generateRecommendationSync(activity);
            log.info("Generated Recommendation for activity {}: {}",
                    activity.getId(), recommendation.getRecommendation());

            // Log the recommendation object before saving
            log.debug("Recommendation object to save: {}", recommendation);

            // Save the Recommendation object
            Recommendation savedRecommendation = recommendationRepository.save(recommendation);
            log.info("Successfully saved recommendation with ID: {} for activity: {}",
                    savedRecommendation.getId(), activity.getId());

            // Verify the save operation
            if (savedRecommendation.getId() != null) {
                log.info("Recommendation saved successfully with database ID: {}", savedRecommendation.getId());

                // Optional: Verify by reading back from database
                recommendationRepository.findById(savedRecommendation.getId())
                        .ifPresentOrElse(
                                found -> log.info("Verification successful: Found recommendation in database"),
                                () -> log.warn("Verification failed: Recommendation not found in database")
                        );
            } else {
                log.error("Save operation failed: No ID returned for recommendation");
            }

        } catch (DataAccessException e) {
            log.error("Database error while processing activity {}: {}", activity.getId(), e.getMessage(), e);
            // Implement retry logic or dead letter queue here
        } catch (Exception e) {
            log.error("Unexpected error processing activity {}: {}", activity.getId(), e.getMessage(), e);
            // You might want to implement retry logic or dead letter queue here
        }
    }
}