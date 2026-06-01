package com.skillexchange.controller;

import com.skillexchange.dto.UserCreateDTO;
import com.skillexchange.dto.UserLoginDTO;
import com.skillexchange.dto.UserResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skillexchange.dto.ChangePasswordDTO;
import com.skillexchange.dto.ForgotPasswordDTO;
import com.skillexchange.dto.ResetPasswordDTO;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /auth/register
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserCreateDTO userData) {
        return authService.registerAndLogin(userData);
    }

    // POST /auth/login — returns {"access_token": "...", "token_type": "bearer"}
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserLoginDTO loginData) {
        return authService.login(loginData.getEmail(), loginData.getPassword());
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody ForgotPasswordDTO dto) {

        authService.forgotPassword(dto.getEmail());

        return Map.of("message", "Password reset link generated");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody ResetPasswordDTO dto) {

        authService.resetPassword(dto.getToken(), dto.getNewPassword());

        return Map.of("message", "Password updated successfully");
    }

    // GET /auth/me — returns current user with average_rating
    @GetMapping("/me")
    public UserResponseDTO me(@AuthenticationPrincipal User currentUser) {
        return authService.toResponseDTO(currentUser);
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody ChangePasswordDTO dto,
            @AuthenticationPrincipal User user) {
        authService.changePassword(user, dto.getOldPassword(), dto.getNewPassword());
        return Map.of("message", "Password updated successfully");
    }

    @PostMapping("/upload-profile")
    public Map<String, String> uploadProfile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) throws Exception {

        String url = authService.uploadProfile(file, user);

        return Map.of("url", url);
    }

    @DeleteMapping("/delete-account")
    public Map<String, String> deleteAccount(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }
        authService.deleteAccount(user);
        return Map.of("message", "Account deleted successfully");
    }
}