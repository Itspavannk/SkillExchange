package com.skillexchange.service;

import com.skillexchange.dto.DisputeCreateDTO;
import com.skillexchange.dto.DisputeResponseDTO;
import com.skillexchange.entity.Booking;
import com.skillexchange.entity.Booking.BookingStatus;
import com.skillexchange.entity.Dispute;
import com.skillexchange.entity.Transaction;
import com.skillexchange.entity.User;
import com.skillexchange.repository.BookingRepository;
import com.skillexchange.repository.DisputeRepository;
import com.skillexchange.repository.TransactionRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.skillexchange.repository.SkillRepository;
import com.skillexchange.entity.Skill;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public DisputeService(DisputeRepository disputeRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            SkillRepository skillRepository) {
        this.disputeRepository = disputeRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // Raise dispute
    @Transactional
    public DisputeResponseDTO raiseDispute(Long bookingId, DisputeCreateDTO data, User currentUser) {

        Booking booking = bookingRepository.findById(
                Objects.requireNonNull(bookingId, "Booking ID cannot be null"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (booking.getStatus() == BookingStatus.refunded) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking already refunded");
        }

        if (booking.getStatus() == BookingStatus.disputed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking already under dispute");
        }

        if (booking.getStatus() != BookingStatus.teacher_marked_complete &&
                booking.getStatus() != BookingStatus.completed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot dispute this booking");
        }

        if (!currentUser.getId().equals(booking.getLearnerId()) &&
                !currentUser.getId().equals(booking.getTeacherId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not part of this booking");
        }

        Dispute dispute = new Dispute();
        dispute.setBookingId(bookingId);
        dispute.setRaisedBy(currentUser.getId());
        dispute.setReason(data.getReason());
        dispute.setStatus("open");

        booking.setStatus(BookingStatus.disputed);
        bookingRepository.save(booking);

        return toResponseDTO(disputeRepository.save(dispute));
    }

    // My disputes
    public List<DisputeResponseDTO> myDisputes(Long userId) {
        return disputeRepository.findByRaisedBy(userId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Admin view all disputes
    public List<DisputeResponseDTO> allDisputes() {
        return disputeRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Resolve dispute
    @Transactional
    public DisputeResponseDTO resolveDispute(Long disputeId, boolean refund, String adminNote) {

        Dispute dispute = disputeRepository.findById(
                Objects.requireNonNull(disputeId, "Dispute ID cannot be null"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispute not found"));

        if (!"open".equals(dispute.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dispute already handled");
        }

        Booking booking = bookingRepository.findById(
                Objects.requireNonNull(dispute.getBookingId(), "Booking ID cannot be null"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (refund) {

            User teacher = userRepository.findById(
                    Objects.requireNonNull(booking.getTeacherId(), "Teacher ID cannot be null"))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

            User learner = userRepository.findById(
                    Objects.requireNonNull(booking.getLearnerId(), "Learner ID cannot be null"))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner not found"));

            if (teacher.getCredits() < booking.getTotalCredits()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Teacher does not have enough credits for refund");
            }

            teacher.setCredits(teacher.getCredits() - booking.getTotalCredits());
            learner.setCredits(learner.getCredits() + booking.getTotalCredits());

            userRepository.save(teacher);
            userRepository.save(learner);

            Transaction tx = new Transaction();
            tx.setSenderId(teacher.getId());
            tx.setReceiverId(learner.getId());
            tx.setAmount(booking.getTotalCredits());
            tx.setType("dispute_refund");

            transactionRepository.save(tx);

            booking.setStatus(BookingStatus.refunded);
            dispute.setStatus("resolved");

        } else {

            booking.setStatus(BookingStatus.completed);
            dispute.setStatus("rejected");

        }

        bookingRepository.save(booking);

        dispute.setAdminNote(adminNote);
        dispute.setResolvedAt(LocalDateTime.now());

        return toResponseDTO(disputeRepository.save(dispute));
    }

    private DisputeResponseDTO toResponseDTO(Dispute dispute) {

        DisputeResponseDTO dto = new DisputeResponseDTO();

        dto.setId(dispute.getId());
        dto.setBookingId(dispute.getBookingId());
        dto.setRaisedBy(dispute.getRaisedBy());
        dto.setReason(dispute.getReason());
        dto.setStatus(dispute.getStatus());
        dto.setAdminNote(dispute.getAdminNote());
        dto.setCreatedAt(dispute.getCreatedAt());
        dto.setResolvedAt(dispute.getResolvedAt());

        Long bookingId = dispute.getBookingId();
        if (bookingId != null) {
            bookingRepository.findById(bookingId).ifPresent(booking -> {

                // Raised By
                Long raisedById = dispute.getRaisedBy();
                if (raisedById != null) {
                    userRepository.findById(raisedById)
                            .ifPresent(user -> dto.setRaisedByName(user.getName()));
                }

                // Teacher
                Long teacherId = booking.getTeacherId();
                if (teacherId != null) {
                    userRepository.findById(teacherId)
                            .ifPresent(user -> dto.setTeacherName(user.getName()));
                }

                // Learner
                Long learnerId = booking.getLearnerId();
                if (learnerId != null) {
                    userRepository.findById(learnerId)
                            .ifPresent(user -> dto.setLearnerName(user.getName()));
                }

                // Skill
                Skill skill = booking.getSkill();
                if (skill != null) {
                    dto.setSkillTitle(skill.getTitle());
                }

            });
        }

        return dto;
    }
}