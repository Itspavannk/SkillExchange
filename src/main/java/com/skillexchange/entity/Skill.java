package com.skillexchange.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false)
    private String title;

    @Column(length = 500, nullable = false)
    private String description;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(length = 50, nullable = false)
    private String level;

    @Column(name = "credits_per_hour", nullable = false)
    private Integer creditsPerHour;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Skill-specific rating (separate from owner/teacher rating)
    @Column(name = "skill_rating_total")
    private Integer skillRatingTotal = 0;

    @Column(name = "skill_rating_count")
    private Integer skillRatingCount = 0;

    public Skill() {}

    public Long getId() { return id; }

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

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getSkillRatingTotal() { return skillRatingTotal; }
    public void setSkillRatingTotal(Integer skillRatingTotal) { this.skillRatingTotal = skillRatingTotal; }

    public Integer getSkillRatingCount() { return skillRatingCount; }
    public void setSkillRatingCount(Integer skillRatingCount) { this.skillRatingCount = skillRatingCount; }
}