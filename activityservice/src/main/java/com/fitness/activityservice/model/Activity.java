package com.fitness.activityservice.model;

import jakarta.persistence.Column;
import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "activities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    @Id
    private String id;

    private String userId;

    @Column(nullable = false)
    private ActivityType type;

    @Column(nullable = false)
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;

    @Field("additionalMetrics") // Fixed field name
    private Map<String, Object> additionalMatrices;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}