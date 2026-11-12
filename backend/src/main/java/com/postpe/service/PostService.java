package com.postpe.service;

import com.postpe.dto.request.PostRequest;
import com.postpe.dto.response.*;
import com.postpe.entity.*;
import com.postpe.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final PostImageRepository postImageRepository;
    private final AuthService authService;

    @Value("${app.upload.path}")
    private String uploadPath;

    public PagedResponse<PostResponse> getPosts(String search, String categorySlug, String city,
                                                 String postType, BigDecimal minPrice, BigDecimal maxPrice,
                                                 int page, int size, String sortBy, User currentUser) {
        Pageable pageable = PageRequest.of(page, size, resolveSort(sortBy));

        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), Post.PostStatus.ACTIVE));

            if (StringUtils.hasText(search)) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (StringUtils.hasText(categorySlug)) {
                predicates.add(cb.equal(root.get("category").get("slug"), categorySlug));
            }
            if (StringUtils.hasText(city)) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(postType)) {
                try {
                    predicates.add(cb.equal(root.get("postType"), Post.PostType.valueOf(postType.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Post> postPage = postRepository.findAll(spec, pageable);
        List<PostResponse> responses = postPage.getContent().stream()
                .map(p -> mapToResponse(p, currentUser))
                .toList();

        return PagedResponse.<PostResponse>builder()
                .content(responses)
                .page(page)
                .size(size)
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .last(postPage.isLast())
                .build();
    }

    @Transactional
    public PostResponse getPostById(UUID id, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        postRepository.incrementViews(id);
        post.setViews(post.getViews() + 1);
        return mapToResponse(post, currentUser);
    }

    @Transactional
    public PostResponse createPost(PostRequest request, User user) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Post post = Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(category)
                .user(user)
                .location(request.getLocation())
                .city(request.getCity())
                .state(request.getState())
                .postType(Post.PostType.valueOf(request.getPostType().toUpperCase()))
                .build();

        return mapToResponse(postRepository.save(post), user);
    }

    @Transactional
    public PostResponse updatePost(UUID id, PostRequest request, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only edit your own posts");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setPrice(request.getPrice());
        post.setCategory(category);
        post.setLocation(request.getLocation());
        post.setCity(request.getCity());
        post.setState(request.getState());
        post.setPostType(Post.PostType.valueOf(request.getPostType().toUpperCase()));

        return mapToResponse(postRepository.save(post), user);
    }

    @Transactional
    public void deletePost(UUID id, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only delete your own posts");
        }

        post.setStatus(Post.PostStatus.DELETED);
        postRepository.save(post);
    }

    public PagedResponse<PostResponse> getMyPosts(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postPage = postRepository.findByUserAndStatusNot(user, Post.PostStatus.DELETED, pageable);

        return PagedResponse.<PostResponse>builder()
                .content(postPage.getContent().stream().map(p -> mapToResponse(p, user)).toList())
                .page(page)
                .size(size)
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .last(postPage.isLast())
                .build();
    }

    @Transactional
    public boolean toggleFavorite(UUID postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Optional<Favorite> existing = favoriteRepository.findByUserAndPost(user, post);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false;
        } else {
            favoriteRepository.save(Favorite.builder().user(user).post(post).build());
            return true;
        }
    }

    public PagedResponse<PostResponse> getFavorites(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Favorite> favPage = favoriteRepository.findByUser(user, pageable);

        return PagedResponse.<PostResponse>builder()
                .content(favPage.getContent().stream().map(f -> mapToResponse(f.getPost(), user)).toList())
                .page(page)
                .size(size)
                .totalElements(favPage.getTotalElements())
                .totalPages(favPage.getTotalPages())
                .last(favPage.isLast())
                .build();
    }

    @Transactional
    public List<PostImageResponse> uploadImages(UUID postId, MultipartFile[] files, User user) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only upload images to your own posts");
        }

        Path uploadDir = Paths.get(uploadPath, "posts", postId.toString());
        Files.createDirectories(uploadDir);

        List<PostImageResponse> responses = new ArrayList<>();
        int order = post.getImages().size();

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/posts/" + postId + "/" + filename;
            PostImage image = PostImage.builder()
                    .post(post)
                    .url(url)
                    .displayOrder(order++)
                    .build();

            image = postImageRepository.save(image);
            responses.add(PostImageResponse.builder()
                    .id(image.getId())
                    .url(image.getUrl())
                    .displayOrder(image.getDisplayOrder())
                    .build());
        }
        return responses;
    }

    @Transactional
    public void deleteImage(UUID postId, UUID imageId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        if (!post.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not authorized");
        }
        PostImage image = postImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));
        postImageRepository.delete(image);
    }

    public List<PostResponse> getRelatedPosts(UUID postId, Long categoryId) {
        return postRepository.findTop6ByCategoryIdAndStatusAndIdNot(categoryId, Post.PostStatus.ACTIVE, postId)
                .stream().map(p -> mapToResponse(p, null)).toList();
    }

    public List<PostResponse> getFeaturedPosts() {
        return postRepository.findTop8ByFeaturedTrueAndStatus(Post.PostStatus.ACTIVE)
                .stream().map(p -> mapToResponse(p, null)).toList();
    }

    private Sort resolveSort(String sortBy) {
        return switch (sortBy == null ? "newest" : sortBy) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "oldest" -> Sort.by("createdAt").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }

    public PostResponse mapToResponse(Post post, User currentUser) {
        boolean isFavorited = currentUser != null &&
                favoriteRepository.existsByUserAndPost(currentUser, post);

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .price(post.getPrice())
                .category(CategoryResponse.builder()
                        .id(post.getCategory().getId())
                        .name(post.getCategory().getName())
                        .slug(post.getCategory().getSlug())
                        .iconName(post.getCategory().getIconName())
                        .build())
                .user(authService.mapToUserResponse(post.getUser(), 0))
                .location(post.getLocation())
                .city(post.getCity())
                .state(post.getState())
                .status(post.getStatus().name())
                .postType(post.getPostType().name())
                .featured(post.isFeatured())
                .views(post.getViews())
                .images(post.getImages().stream().map(img ->
                        PostImageResponse.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .displayOrder(img.getDisplayOrder())
                                .build()).toList())
                .favorited(isFavorited)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
