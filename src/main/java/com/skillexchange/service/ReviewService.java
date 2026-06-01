package com.skillexchange.service;

import com.skillexchange.dto.ReviewCreateDTO;
import com.skillexchange.dto.ReviewResponseDTO;
import com.skillexchange.entity.Booking;
import com.skillexchange.entity.Booking.BookingStatus;
import com.skillexchange.entity.Review;
import com.skillexchange.entity.User;
import com.skillexchange.repository.BookingRepository;
import com.skillexchange.repository.ReviewRepository;
import com.skillexchange.repository.SkillRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public ReviewService(ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            SkillRepository skillRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public ReviewResponseDTO createReview(Long bookingId, ReviewCreateDTO data, User currentUser) {

        if (bookingId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking ID cannot be null");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (booking.getStatus() != BookingStatus.completed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only review completed bookings");
        }

        if (!currentUser.getId().equals(booking.getLearnerId())
                && !currentUser.getId().equals(booking.getTeacherId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not part of this booking");
        }

        if (data.getRating() < 1 || data.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        if (reviewRepository.existsByBookingIdAndReviewerId(bookingId, currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already reviewed this booking");
        }

        Long revieweeId = currentUser.getId().equals(booking.getLearnerId())
                ? booking.getTeacherId()
                : booking.getLearnerId();

        Review review = new Review();
        review.setBookingId(bookingId);
        review.setSkillId(booking.getSkill().getId());
        review.setReviewerId(currentUser.getId());
        review.setRevieweeId(revieweeId);
        review.setRating(data.getRating());
        review.setComment(data.getComment());
        reviewRepository.save(review);

        // Update teacher (user) rating
        if (revieweeId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reviewee ID cannot be null");
        }
        User reviewee = userRepository.findById(revieweeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reviewee not found"));
        reviewee.setRatingTotal(reviewee.getRatingTotal() + data.getRating());
        reviewee.setRatingCount(reviewee.getRatingCount() + 1);
        userRepository.save(reviewee);

        // Update skill rating — only when learner reviews teacher
        Long skillId = booking.getSkill().getId();
        if (currentUser.getId().equals(booking.getLearnerId()) && skillId != null) {
            skillRepository.findById(skillId).ifPresent(skill -> {
                skill.setSkillRatingTotal(skill.getSkillRatingTotal() + data.getRating());
                skill.setSkillRatingCount(skill.getSkillRatingCount() + 1);
                skillRepository.save(skill);
            });
        }

        return toResponseDTO(review, currentUser.getName());
    }

    public List<ReviewResponseDTO> userReviews(Long userId) {
        return reviewRepository.findByRevieweeId(userId)
                .stream()
                .map(r -> toResponseDTO(r, getUserName(r.getReviewerId())))
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> bookingReviews(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId)
                .stream()
                .map(r -> toResponseDTO(r, getUserName(r.getReviewerId())))
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> reviewsGiven(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId)
                .stream()
                .map(r -> toResponseDTO(r, getUserName(r.getReviewerId())))
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> reviewsReceived(Long revieweeId) {
        return reviewRepository.findByRevieweeId(revieweeId)
                .stream()
                .map(r -> toResponseDTO(r, getUserName(r.getReviewerId())))
                .collect(Collectors.toList());
    }

    private String getUserName(Long userId) {
        if (userId == null)
            return "Unknown";
        return userRepository.findById(userId).map(User::getName).orElse("Unknown");
    }

    private ReviewResponseDTO toResponseDTO(Review review, String reviewerName) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setBookingId(review.getBookingId());
        dto.setReviewerId(review.getReviewerId());
        dto.setReviewerName(reviewerName);
        dto.setRevieweeId(review.getRevieweeId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}