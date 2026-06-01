package com.skillexchange.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disputes", uniqueConstraints = {
        // UniqueConstraint("booking_id", name="one_dispute_per_booking")
        @UniqueConstraint(name = "one_dispute_per_booking", columnNames = { "booking_id" })
})
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "raised_by", nullable = false)
    private Long raisedBy;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    // status in ("open", "resolved", "rejected")
    @Column(length = 20, nullable = false)
    private String status = "open";

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // resolved_at field
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public Dispute() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getRaisedBy() {
        return raisedBy;
    }

    public void setRaisedBy(Long raisedBy) {
        this.raisedBy = raisedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}