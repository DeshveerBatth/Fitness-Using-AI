package com.fitness.aiservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recommendations") // This should match your collection name
public class Recommendation {

    @Id
    private String id;

    @Field("activity_id")
    private String activityId;

    @Field("user_id")
    private String userId;

    @Field("activity_type")
    private String activityType;

    @Field("recommendation")
    private String recommendation;

    @Field("improvements")
    private List<String> improvements;

    @Field("suggestions")
    private List<String> suggestions;

    @Field("safety")
    private List<String> safety;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;
}