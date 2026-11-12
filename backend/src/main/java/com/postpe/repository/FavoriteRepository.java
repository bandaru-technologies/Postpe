package com.postpe.repository;

import com.postpe.entity.Favorite;
import com.postpe.entity.Post;
import com.postpe.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    Optional<Favorite> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    Page<Favorite> findByUser(User user, Pageable pageable);
    long countByPost(Post post);
}
