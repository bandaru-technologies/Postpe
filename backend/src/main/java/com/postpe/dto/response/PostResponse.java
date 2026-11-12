package com.postpe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PostResponse {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private CategoryResponse category;
    private UserResponse user;
    private String location;
    private String city;
    private String state;
    private String status;
    private String postType;
    private boolean featured;
    private int views;
    private List<PostImageResponse> images;
    private boolean favorited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
