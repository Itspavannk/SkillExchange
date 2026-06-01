package com.skillexchange.controller;

import com.skillexchange.dto.ReviewCreateDTO;
import com.skillexchange.dto.ReviewResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.ReviewService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // POST /reviews/{booking_id} — was completely missing
    @PostMapping("/{bookingId}")
    public ReviewResponseDTO createReview(@PathVariable Long bookingId,
            @RequestBody ReviewCreateDTO data,
            @AuthenticationPrincipal User currentUser) {
        return reviewService.createReview(bookingId, data, currentUser);
    }

    // GET /reviews/user/{user_id}
    @GetMapping("/user/{userId}")
    public List<ReviewResponseDTO> userReviews(@PathVariable Long userId) {
        return reviewService.userReviews(userId);
    }

    // GET /reviews/booking/{booking_id}
    @GetMapping("/booking/{bookingId}")
    public List<ReviewResponseDTO> bookingReviews(@PathVariable Long bookingId) {
        return reviewService.bookingReviews(bookingId);
    }

    // GET /reviews/me/given
    @GetMapping("/me/given")
    public List<ReviewResponseDTO> reviewsGiven(@AuthenticationPrincipal User currentUser) {
        return reviewService.reviewsGiven(currentUser.getId());
    }

    // GET /reviews/me/received — was missing
    @GetMapping("/me/received")
    public List<ReviewResponseDTO> reviewsReceived(@AuthenticationPrincipal User currentUser) {
        return reviewService.reviewsReceived(currentUser.getId());
    }
}