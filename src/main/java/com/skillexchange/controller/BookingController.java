package com.skillexchange.controller;

import com.skillexchange.dto.BookingCreateDTO;
import com.skillexchange.dto.BookingResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.BookingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // POST /bookings/
    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody BookingCreateDTO request,
            @AuthenticationPrincipal User currentUser) {
        return bookingService.createBooking(request, currentUser);
    }

    // GET /bookings/{booking_id}
    @GetMapping("/{id}")
    public BookingResponseDTO getBooking(@PathVariable @NonNull Long id) {
        return bookingService.getBooking(id);
    }

    // POST /bookings/{booking_id}/complete — teacher only
    @PostMapping("/{id}/complete")
    public BookingResponseDTO completeBooking(@PathVariable @NonNull Long id,
            @AuthenticationPrincipal User currentUser) {
        return bookingService.completeBooking(id, currentUser);
    }

    // POST /bookings/{booking_id}/confirm — learner only
    @PostMapping("/{id}/confirm")
    public BookingResponseDTO confirmBooking(@PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return bookingService.confirmBooking(id, currentUser);
    }

    // POST /bookings/{booking_id}/cancel — learner only
    @PostMapping("/{id}/cancel")
    public BookingResponseDTO cancelBooking(@PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return bookingService.cancelBooking(id, currentUser);

    }

    @PostMapping("/{id}/meeting-link")
    public BookingResponseDTO addMeetingLink(
            @PathVariable @NonNull Long id,
            @RequestParam String link,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return bookingService.addMeetingLink(id, link, currentUser);
    }

    // GET /bookings/me/learner
    @GetMapping("/me/learner")
    public List<BookingResponseDTO> myBookingsAsLearner(@AuthenticationPrincipal User currentUser) {
        return bookingService.learnerBookings(currentUser.getId());
    }

    // GET /bookings/me/teacher
    @GetMapping("/me/teacher")
    public List<BookingResponseDTO> myBookingsAsTeacher(@AuthenticationPrincipal User currentUser) {
        return bookingService.teacherBookings(currentUser.getId());
    }

}