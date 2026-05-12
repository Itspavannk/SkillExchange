package com.skillexchange.dto;

import java.time.LocalDateTime;

// BookingResponse schema with nested UserMini and SkillMini
public class BookingResponseDTO {

    // Nested SkillMini
public static class SkillMini {

    private Long id;
    private String title;
    private String category;
    private int creditsPerHour;       
    private String ownerName;         
    private double ownerAverageRating; 


    public SkillMini() {}

    public SkillMini(Long id, String title, String category,
                     int creditsPerHour, String ownerName, double ownerAverageRating) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.creditsPerHour = creditsPerHour;
        this.ownerName = ownerName;
        this.ownerAverageRating = ownerAverageRating;
    }



    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getCreditsPerHour() { return creditsPerHour; }      // ✅ ADD
    public void setCreditsPerHour(int creditsPerHour) { this.creditsPerHour = creditsPerHour; }

    public String getOwnerName() { return ownerName; }            // ✅ ADD
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public double getOwnerAverageRating() { return ownerAverageRating; } // ✅ ADD
    public void setOwnerAverageRating(double ownerAverageRating) { this.ownerAverageRating = ownerAverageRating; }


}

    // Nested UserMini 
    public static class UserMini {
        private Long id;
        private String name;

        public UserMini() {}
        public UserMini(Long id, String name) {
            this.id = id; this.name = name;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    private Long id;
    private SkillMini skill;
    private UserMini learner;
    private UserMini teacher;
    private Integer hours;
    private Integer totalCredits;
    private String status;
    private LocalDateTime createdAt;
    private boolean hasDispute;
    private LocalDateTime scheduledAt;
    private String meetingLink;


    public BookingResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SkillMini getSkill() { return skill; }
    public void setSkill(SkillMini skill) { this.skill = skill; }

    public UserMini getLearner() { return learner; }
    public void setLearner(UserMini learner) { this.learner = learner; }

    public UserMini getTeacher() { return teacher; }
    public void setTeacher(UserMini teacher) { this.teacher = teacher; }

    public Integer getHours() { return hours; }
    public void setHours(Integer hours) { this.hours = hours; }

    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isHasDispute() {
    return hasDispute;
    }

    public void setHasDispute(boolean hasDispute) {
        this.hasDispute = hasDispute;
    }

        public LocalDateTime getScheduledAt() {
    return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
}