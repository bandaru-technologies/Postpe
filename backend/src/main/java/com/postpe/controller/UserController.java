package com.postpe.controller;

import com.postpe.dto.response.UserResponse;
import com.postpe.entity.User;
import com.postpe.service.AuthService;
import com.postpe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String, String> updates,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userService.updateProfile(user, updates));
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file,
                                                             @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = authService.getCurrentUser(userDetails.getUsername());
        String url = userService.uploadAvatar(user, file);
        return ResponseEntity.ok(Map.of("avatarUrl", url));
    }
}
