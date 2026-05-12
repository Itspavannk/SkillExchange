package com.skillexchange.service;

import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;
import com.skillexchange.dto.UserCreateDTO;
import com.skillexchange.dto.UserResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.security.JwtUtil;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // BCrypt
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

public void deleteAccount(@NonNull User user) {
    userRepository.delete(user);
}

    // POST /auth/register
    public UserResponseDTO register(UserCreateDTO dto) {
    if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
    throw new RuntimeException("Email already registered");
}

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        // hashed_password=hash_password(user_data.password)
        user.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        // credits=100 and rating defaults are set by entity field defaults

        User saved = userRepository.save(user);
        return toResponseDTO(saved);
    }

    public void changePassword(User user, String oldPassword, String newPassword) {

    if (!passwordEncoder.matches(oldPassword, user.getHashedPassword())) {
        throw new RuntimeException("Wrong current password");
    }

    user.setHashedPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);
}

public Map<String, Object> registerAndLogin(UserCreateDTO dto) {

    UserResponseDTO userResponse = register(dto);

    User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow();

    String token = jwtUtil.generateToken(user.getId());

    return Map.of(
            "access_token", token,
            "token_type", "bearer",
            "user", userResponse
    );
}


public Map<String, Object> login(String email, String password) {

    var userOpt = userRepository.findByEmail(email);

    if (userOpt.isEmpty()) {
        return Map.of("error", "Invalid email or pass");
    }

    User user = userOpt.get();

  
    if (!passwordEncoder.matches(password, user.getHashedPassword())) {
        return Map.of("error", "Invalid email or pass");
    }

  
    String token = jwtUtil.generateToken(user.getId());

    return Map.of(
        "access_token", token,
        "token_type", "bearer"
    );
    
}

    // GET /auth/me — returns current user with computed average_rating
    public UserResponseDTO getCurrentUser(User user) {
        return toResponseDTO(user);
    }

    // Converts User entity → UserResponseDTO (never exposes hashed_password)
    public UserResponseDTO toResponseDTO(User user) {
        double average = 0.0;
            if (user == null) {
        throw new RuntimeException("User not authenticated");
    }
        if (user.getRatingCount() > 0) {
            // average = rating_total / rating_count
            average = (double) user.getRatingTotal() / user.getRatingCount();
        }

        UserResponseDTO dto = new UserResponseDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCredits(),
            user.getRatingTotal(),
            user.getRatingCount(),
            Math.round(average * 100.0) / 100.0
        );

       
        dto.setRole(user.getRole());
        dto.setProfileImage(user.getProfileImage()); 
System.out.println("IMAGE: " + user.getProfileImage());
        return dto;
    }


        public  void forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        System.out.println("RESET LINK:");
        System.out.println("http://localhost:3000/reset-password?token=" + token);
    }

        public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        user.setHashedPassword(passwordEncoder.encode(newPassword));

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }

    public String uploadProfile(MultipartFile file, User user) throws Exception {

    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

    Path path = Paths.get("uploads/" + fileName);
    Files.createDirectories(path.getParent());
    Files.write(path, file.getBytes());

    String url = "http://localhost:8080/uploads/" + fileName;

    user.setProfileImage(url);
    userRepository.save(user);

    return url;
}
}