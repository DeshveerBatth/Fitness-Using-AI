package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        log.debug("Fetching recommendation for activity: {}", activityId);
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> {
                    log.warn("No recommendation found for activity: {}", activityId);
                    return new RuntimeException("No recommendations found for activity: " + activityId);
                });
    }

}
