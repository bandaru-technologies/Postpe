package com.postpe.controller;

import com.postpe.dto.request.MessageRequest;
import com.postpe.dto.response.MessageResponse;
import com.postpe.entity.User;
import com.postpe.service.AuthService;
import com.postpe.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getConversations(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(messageService.getConversations(user));
    }

    @GetMapping("/{postId}/{userId}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable UUID postId,
                                                              @PathVariable UUID userId,
                                                              @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(messageService.getConversationMessages(postId, userId, currentUser));
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        User sender = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(messageService.sendMessage(request, sender));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("count", messageService.getUnreadCount(user)));
    }
}
