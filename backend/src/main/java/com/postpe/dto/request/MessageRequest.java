package com.postpe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {

    @NotNull(message = "Receiver is required")
    private UUID receiverId;

    private UUID postId;

    @NotBlank(message = "Content is required")
    private String content;
}
