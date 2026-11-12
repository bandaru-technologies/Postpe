package com.postpe.service;

import com.postpe.dto.request.MessageRequest;
import com.postpe.dto.response.MessageResponse;
import com.postpe.entity.Message;
import com.postpe.entity.Post;
import com.postpe.entity.User;
import com.postpe.repository.MessageRepository;
import com.postpe.repository.PostRepository;
import com.postpe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final AuthService authService;
    private final PostService postService;

    public List<MessageResponse> getConversations(User user) {
        return messageRepository.findConversations(user)
                .stream().map(this::mapToResponse).toList();
    }

    public List<MessageResponse> getConversationMessages(UUID postId, UUID otherUserId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        messageRepository.markAsRead(currentUser, otherUser, post);
        return messageRepository.findConversationMessages(post, currentUser, otherUser)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public MessageResponse sendMessage(MessageRequest request, User sender) {
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new EntityNotFoundException("Receiver not found"));

        Post post = null;
        if (request.getPostId() != null) {
            post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .post(post)
                .content(request.getContent())
                .build();

        return mapToResponse(messageRepository.save(message));
    }

    public long getUnreadCount(User user) {
        return messageRepository.countByReceiverAndReadFalse(user);
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .sender(authService.mapToUserResponse(message.getSender(), 0))
                .receiver(authService.mapToUserResponse(message.getReceiver(), 0))
                .post(message.getPost() != null ? postService.mapToResponse(message.getPost(), null) : null)
                .content(message.getContent())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
