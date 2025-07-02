package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {
    private final ActivityAIService aiService;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity){
        log.info("Received activity for processing: {}", activity.getId());

        // Use the synchronous method instead
        String recommendation = aiService.generateRecommendationSync(activity);
        log.info("Generated Recommendation for activity {}:\n{}", activity.getId(), recommendation);


        // Here you can save to database, send to another queue, etc.
    }
}