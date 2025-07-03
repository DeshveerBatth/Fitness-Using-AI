package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
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
            Recommendation recommendation = aiService.generateRecommendationSync(activity);
            log.info("Generated Recommendation for activity {}: {}",
                    activity.getId(), recommendation.getRecommendation());

            // Save the Recommendation object (not String)
            Recommendation savedRecommendation = recommendationRepository.save(recommendation);
            log.info("Successfully saved recommendation with ID: {}", savedRecommendation.getId());

        } catch (Exception e) {
            log.error("Error processing activity {}: {}", activity.getId(), e.getMessage(), e);
            // You might want to implement retry logic or dead letter queue here
        }
    }
}