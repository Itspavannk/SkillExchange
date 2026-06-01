package com.skillexchange.dto;

import java.time.LocalDateTime;

// UserResponse schema — never exposes hashed_password
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Integer credits;
    private Integer ratingTotal;
    private Integer ratingCount;
    private Double averageRating; // Computed: ratingTotal / ratingCount
    private String role;
    private String profileImage;
    private LocalDateTime createdAt;

    public UserResponseDTO() {
    }

    public UserResponseDTO(Long id, String name, String email, Integer credits,
            Integer ratingTotal, Integer ratingCount, Double averageRating) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.credits = credits;
        this.ratingTotal = ratingTotal;
        this.ratingCount = ratingCount;
        this.averageRating = averageRating;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getRatingTotal() {
        return ratingTotal;
    }

    public void setRatingTotal(Integer ratingTotal) {
        this.ratingTotal = ratingTotal;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}