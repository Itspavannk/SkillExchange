package com.skillexchange.controller;

import com.skillexchange.entity.User;
import com.skillexchange.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
           
String contentType = file.getContentType();
if (contentType == null || !contentType.startsWith("image/")) {
    return ResponseEntity.badRequest().body("Only image files are allowed");
}

            if (user == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = file.getOriginalFilename();
            String originalName = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_") : "photo";

        String fileName = System.currentTimeMillis() + "_" + originalName;
            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            String imageUrl = "http://localhost:8080/uploads/" + fileName;
            user.setProfileImage(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}