package com.postpe.repository;

import com.postpe.entity.Message;
import com.postpe.entity.Post;
import com.postpe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender = :user OR m.receiver = :user)
        AND m.id IN (
            SELECT MAX(m2.id) FROM Message m2
            WHERE (m2.sender = :user OR m2.receiver = :user)
            GROUP BY CASE WHEN m2.sender = :user THEN m2.receiver.id ELSE m2.sender.id END,
                     COALESCE(m2.post.id, m2.id)
        )
        ORDER BY m.createdAt DESC
        """)
    List<Message> findConversations(User user);

    @Query("""
        SELECT m FROM Message m
        WHERE m.post = :post
        AND ((m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1))
        ORDER BY m.createdAt ASC
        """)
    List<Message> findConversationMessages(Post post, User user1, User user2);

    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.receiver = :user AND m.sender = :sender AND m.post = :post AND m.read = false")
    void markAsRead(User user, User sender, Post post);

    long countByReceiverAndReadFalse(User receiver);
}
