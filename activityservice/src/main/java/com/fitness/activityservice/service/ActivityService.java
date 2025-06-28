package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;

    public ActivityResponse trackActivity(ActivityRequest request){

        log.error("🔥🔥🔥 ACTIVITY SERVICE - trackActivity METHOD CALLED 🔥🔥🔥");
        log.error("🔥🔥🔥 USER ID: {} 🔥🔥🔥", request.getUserId());

        // Add explicit null check
        if (userValidationService == null) {
            log.error("🔥🔥🔥 USER VALIDATION SERVICE IS NULL! 🔥🔥🔥");
            throw new RuntimeException("UserValidationService is null!");
        }

        log.error("🔥🔥🔥 CALLING validateUser... 🔥🔥🔥");
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        log.error("🔥🔥🔥 validateUser RETURNED: {} 🔥🔥🔥", isValidUser);

        if(!isValidUser){
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

        return mapToResponse(savedActivity);
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