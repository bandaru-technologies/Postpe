package com.postpe.repository;

import com.postpe.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostImageRepository extends JpaRepository<PostImage, UUID> {
}
