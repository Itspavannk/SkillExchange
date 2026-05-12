package com.skillexchange.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    // BookingStatus enum exactly
    public enum BookingStatus {
        pending,
        teacher_marked_complete,
        completed,
        cancelled,
        disputed,
        refunded
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "learner_id", nullable = false)
    private Long learnerId;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(nullable = false)
    private Integer hours;

    @Column(name = "total_credits", nullable = false)
    private Integer totalCredits;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.pending;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "meeting_link")
    private String meetingLink;

    // model timestamp fields
    @Column(name = "teacher_completed_at")
    private LocalDateTime teacherCompletedAt;

    @Column(name = "learner_confirmed_at")
    private LocalDateTime learnerConfirmedAt;

    @Column(name = "escrow_released_at")
    private LocalDateTime escrowReleasedAt;

    public Booking() {}

    // Getters and Setters

    public Long getId() { return id; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public Integer getHours() { return hours; }
    public void setHours(Integer hours) { this.hours = hours; }

    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getTeacherCompletedAt() { return teacherCompletedAt; }
    public void setTeacherCompletedAt(LocalDateTime teacherCompletedAt) { this.teacherCompletedAt = teacherCompletedAt; }

    public LocalDateTime getLearnerConfirmedAt() { return learnerConfirmedAt; }
    public void setLearnerConfirmedAt(LocalDateTime learnerConfirmedAt) { this.learnerConfirmedAt = learnerConfirmedAt; }

    public LocalDateTime getEscrowReleasedAt() { return escrowReleasedAt; }
    public void setEscrowReleasedAt(LocalDateTime escrowReleasedAt) { this.escrowReleasedAt = escrowReleasedAt; }

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