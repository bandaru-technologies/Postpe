package com.postpe.controller;

import com.postpe.dto.request.PostRequest;
import com.postpe.dto.response.PagedResponse;
import com.postpe.dto.response.PostImageResponse;
import com.postpe.dto.response.PostResponse;
import com.postpe.entity.User;
import com.postpe.service.AuthService;
import com.postpe.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<PagedResponse<PostResponse>> getPosts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String postType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userDetails != null ? authService.getCurrentUser(userDetails.getUsername()) : null;
        return ResponseEntity.ok(postService.getPosts(search, category, city, postType, minPrice, maxPrice, page, size, sort, currentUser));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PostResponse>> getFeatured() {
        return ResponseEntity.ok(postService.getFeaturedPosts());
    }

    @GetMapping("/my-posts")
    public ResponseEntity<PagedResponse<PostResponse>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(postService.getMyPosts(user, page, size));
    }

    @GetMapping("/favorites")
    public ResponseEntity<PagedResponse<PostResponse>> getFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(postService.getFavorites(user, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable UUID id,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userDetails != null ? authService.getCurrentUser(userDetails.getUsername()) : null;
        return ResponseEntity.ok(postService.getPostById(id, currentUser));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<PostResponse>> getRelated(@PathVariable UUID id,
                                                          @RequestParam Long categoryId) {
        return ResponseEntity.ok(postService.getRelatedPosts(id, categoryId));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(postService.createPost(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable UUID id,
                                                    @Valid @RequestBody PostRequest request,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(postService.updatePost(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable UUID id,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        postService.deletePost(id, user);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@PathVariable UUID id,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        boolean favorited = postService.toggleFavorite(id, user);
        return ResponseEntity.ok(Map.of("favorited", favorited));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<List<PostImageResponse>> uploadImages(@PathVariable UUID id,
                                                                  @RequestParam("files") MultipartFile[] files,
                                                                  @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(postService.uploadImages(id, files, user));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable UUID id,
                                                            @PathVariable UUID imageId,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        postService.deleteImage(id, imageId, user);
        return ResponseEntity.ok(Map.of("message", "Image deleted"));
    }
}
