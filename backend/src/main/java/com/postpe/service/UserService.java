package com.postpe.service;

import com.postpe.dto.response.UserResponse;
import com.postpe.entity.Post;
import com.postpe.entity.User;
import com.postpe.repository.PostRepository;
import com.postpe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final AuthService authService;

    @Value("${app.upload.path}")
    private String uploadPath;

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Specification<Post> spec = (root, query, cb) ->
                cb.and(
                        cb.equal(root.get("user"), user),
                        cb.equal(root.get("status"), Post.PostStatus.ACTIVE)
                );
        long postCount = postRepository.count(spec);
        return authService.mapToUserResponse(user, postCount);
    }

    @Transactional
    public UserResponse updateProfile(User user, Map<String, String> updates) {
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("phone")) {
            String phone = updates.get("phone");
            if (!phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
                throw new IllegalArgumentException("Phone number already in use");
            }
            user.setPhone(phone);
        }
        user = userRepository.save(user);
        return authService.mapToUserResponse(user, 0);
    }

    @Transactional
    public String uploadAvatar(User user, MultipartFile file) throws IOException {
        Path uploadDir = Paths.get(uploadPath, "avatars");
        Files.createDirectories(uploadDir);

        String filename = user.getId() + "_" + StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/avatars/" + filename;
        user.setAvatarUrl(url);
        userRepository.save(user);
        return url;
    }
}
