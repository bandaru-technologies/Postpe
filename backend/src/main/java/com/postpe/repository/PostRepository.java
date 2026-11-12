package com.postpe.repository;

import com.postpe.entity.Post;
import com.postpe.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID>, JpaSpecificationExecutor<Post> {

    Page<Post> findByUserAndStatusNot(User user, Post.PostStatus status, Pageable pageable);

    List<Post> findTop6ByCategoryIdAndStatusAndIdNot(Long categoryId, Post.PostStatus status, UUID postId);

    List<Post> findTop8ByFeaturedTrueAndStatus(Post.PostStatus status);

    @Modifying
    @Query("UPDATE Post p SET p.views = p.views + 1 WHERE p.id = :id")
    void incrementViews(UUID id);
}
