package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.name}")  // Changed to match your YAML
    private String routingKey;

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    public ActivityResponse trackActivity(ActivityRequest request){

        log.error("🔥🔥🔥 ACTIVITY SERVICE - trackActivity METHOD CALLED 🔥🔥🔥");
        log.error("🔥🔥🔥 USER ID: {} 🔥🔥🔥", request.getUserId());

        // Add explicit null check
        if (userValidationService == null) {
            log.error("🔥🔥🔥 USER VALIDATION SERVICE IS NULL! 🔥🔥🔥");
            throw new RuntimeException("UserValidationService is null!");
        }

        log.error("🔥🔥🔥 CALLING validateUser... 🔥🔥🔥");

        // Enhanced logging before validation call
        log.error("🔍🔍🔍 VALIDATION ATTEMPT - User ID Format Check: {} 🔍🔍🔍", request.getUserId());
        log.error("🔍🔍🔍 User ID Length: {} 🔍🔍🔍", request.getUserId() != null ? request.getUserId().length() : "NULL");
        log.error("🔍🔍🔍 User ID is UUID format: {} 🔍🔍🔍", isValidUUID(request.getUserId()));

        boolean isValidUser;
        try {
            log.error("🔍🔍🔍 ATTEMPTING USER VALIDATION CALL... 🔍🔍🔍");
            isValidUser = userValidationService.validateUser(request.getUserId());
            log.error("🔍🔍🔍 USER VALIDATION CALL COMPLETED SUCCESSFULLY 🔍🔍🔍");
            log.error("🔥🔥🔥 validateUser RETURNED: {} 🔥🔥🔥", isValidUser);
        } catch (Exception e) {
            log.error("🚨🚨🚨 EXCEPTION DURING USER VALIDATION! 🚨🚨🚨");
            log.error("🚨🚨🚨 Exception Type: {} 🚨🚨🚨", e.getClass().getSimpleName());
            log.error("🚨🚨🚨 Exception Message: {} 🚨🚨🚨", e.getMessage());
            log.error("🚨🚨🚨 Root Cause: {} 🚨🚨🚨", e.getCause() != null ? e.getCause().getMessage() : "No root cause");

            // Check if it's a connection-related exception
            if (isConnectionException(e)) {
                log.error("🌐🌐🌐 CONNECTION ISSUE DETECTED! 🌐🌐🌐");
                log.error("🌐🌐🌐 This appears to be a connectivity problem with user service 🌐🌐🌐");
            } else {
                log.error("❓❓❓ NON-CONNECTION EXCEPTION - Check user service logic ❓❓❓");
            }

            throw new RuntimeException("User validation failed due to service error: " + e.getMessage(), e);
        }

        if(!isValidUser){
            log.error("🔥🔥🔥 USER VALIDATION FAILED! 🔥🔥🔥");
            log.error("📋📋📋 VALIDATION FAILURE ANALYSIS: 📋📋📋");
            log.error("📋📋📋 - User ID: {} 📋📋📋", request.getUserId());
            log.error("📋📋📋 - User ID Format Valid: {} 📋📋📋", isValidUUID(request.getUserId()));
            log.error("📋📋📋 - No exceptions thrown (connection seems OK) 📋📋📋");
            log.error("📋📋📋 - User likely doesn't exist in database 📋📋📋");
            log.error("🔥🔥🔥 THROWING RUNTIME EXCEPTION! 🔥🔥🔥");
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        log.error("🔥🔥🔥 VALIDATION PASSED - CREATING ACTIVITY 🔥🔥🔥");

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMatrices(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);
        log.error("🔥🔥🔥 ACTIVITY SAVED WITH ID: {} 🔥🔥🔥", savedActivity.getId());

        try{
            rabbitTemplate.convertAndSend(exchange, routingKey,savedActivity);
        } catch(Exception e){
            log.error("Failed to publish the activity to rabbitmq");
        }

        return mapToResponse(savedActivity);
    }

    // Helper method to check if string is valid UUID format
    private boolean isValidUUID(String uuid) {
        if (uuid == null) return false;
        try {
            java.util.UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    // Helper method to identify connection-related exceptions
    private boolean isConnectionException(Exception e) {
        String message = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
        String className = e.getClass().getSimpleName().toLowerCase();

        return message.contains("connection") ||
                message.contains("timeout") ||
                message.contains("refused") ||
                message.contains("unreachable") ||
                message.contains("network") ||
                className.contains("connection") ||
                className.contains("timeout") ||
                className.contains("socket") ||
                e.getCause() != null && isConnectionException(new RuntimeException(e.getCause()));
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse response = new ActivityResponse();

        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMatrices(activity.getAdditionalMatrices());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return  activities.stream()
                .map(this:: mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this:: mapToResponse)
                .orElseThrow(()-> new RuntimeException("Activity not found with id: " + activityId));
    }
}