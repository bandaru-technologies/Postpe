package com.postpe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private BigDecimal price;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String location;
    private String city;
    private String state;

    private String postType = "SELL";
}
