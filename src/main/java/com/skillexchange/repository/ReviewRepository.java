package com.skillexchange.repository;

import com.skillexchange.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRevieweeId(Long revieweeId);

    List<Review> findByBookingId(Long bookingId);

    List<Review> findByReviewerId(Long reviewerId);

    // IntegrityError on unique_review_per_user_per_booking
    boolean existsByBookingIdAndReviewerId(Long bookingId, Long reviewerId);
}