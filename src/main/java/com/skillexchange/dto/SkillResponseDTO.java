package com.skillexchange.dto;

import java.time.LocalDateTime;

public class SkillResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String level;
    private Integer creditsPerHour;
    private Long ownerId;
    private String ownerName;
    private Integer ownerRatingCount;
    private Double ownerAverageRating;
    private LocalDateTime createdAt;

    // Skill-specific rating
    private Integer skillRatingCount;
    private Double skillAverageRating;

    public SkillResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Integer getCreditsPerHour() { return creditsPerHour; }
    public void setCreditsPerHour(Integer creditsPerHour) { this.creditsPerHour = creditsPerHour; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public Integer getOwnerRatingCount() { return ownerRatingCount; }
    public void setOwnerRatingCount(Integer ownerRatingCount) { this.ownerRatingCount = ownerRatingCount; }

    public Double getOwnerAverageRating() { return ownerAverageRating; }
    public void setOwnerAverageRating(Double ownerAverageRating) { this.ownerAverageRating = ownerAverageRating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getSkillRatingCount() { return skillRatingCount; }
    public void setSkillRatingCount(Integer skillRatingCount) { this.skillRatingCount = skillRatingCount; }

    public Double getSkillAverageRating() { return skillAverageRating; }
    public void setSkillAverageRating(Double skillAverageRating) { this.skillAverageRating = skillAverageRating; }
}