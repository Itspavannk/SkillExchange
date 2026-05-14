package com.skillexchange.service;

import com.skillexchange.dto.BookingCreateDTO;
import com.skillexchange.dto.BookingResponseDTO;
import com.skillexchange.entity.Booking;
import com.skillexchange.entity.Booking.BookingStatus;
import com.skillexchange.entity.Skill;
import com.skillexchange.entity.Transaction;
import com.skillexchange.entity.User;
import com.skillexchange.repository.BookingRepository;
import com.skillexchange.repository.SkillRepository;
import com.skillexchange.repository.TransactionRepository;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.repository.DisputeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final DisputeRepository disputeRepository;

    public BookingService(BookingRepository bookingRepository,
            SkillRepository skillRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            DisputeRepository disputeRepository) {

        this.bookingRepository = bookingRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.disputeRepository = disputeRepository;
    }

    // GET SINGLE BOOKING
    public BookingResponseDTO getBooking(@NonNull Long id) {
        return toResponseDTO(getOrThrow(id));
    }

    // ADD MEETING LINK
    @Transactional
    public BookingResponseDTO addMeetingLink(@NonNull Long bookingId, String link, User currentUser) {

        Booking booking = getOrThrow(bookingId);

        if (!booking.getTeacherId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only teacher can add link");
        }

        booking.setMeetingLink(link);

        return toResponseDTO(bookingRepository.save(booking));
    }

    // LEARNER BOOKINGS
    public List<BookingResponseDTO> learnerBookings(Long learnerId) {
        return bookingRepository.findByLearnerId(learnerId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // TEACHER BOOKINGS
    public List<BookingResponseDTO> teacherBookings(Long teacherId) {
        return bookingRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // CREATE BOOKING
    @Transactional
    public BookingResponseDTO createBooking(BookingCreateDTO request, User currentUser) {

        Long skillId = request.getSkillId(); // ✅ FIXED

        if (skillId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill ID is required");
        }

        if (request.getHours() == null || request.getHours() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hours must be greater than 0");
        }

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        if (skill.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot book your own skill");
        }

        int hours = request.getHours();
        int totalCredits = skill.getCreditsPerHour() * hours;

        if (currentUser.getCredits() < totalCredits) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient credits");
        }

        currentUser.setCredits(currentUser.getCredits() - totalCredits);
        userRepository.save(currentUser);

        Booking booking = new Booking();
        booking.setSkill(skill);
        booking.setLearnerId(currentUser.getId());
        booking.setTeacherId(skill.getOwner().getId());
        booking.setHours(hours);

        if (request.getScheduledAt() != null) {

            LocalDateTime scheduledTime = LocalDateTime.parse(
                    request.getScheduledAt().replace(" ", "T"));

            LocalDateTime minimumAllowed = LocalDateTime.now().plusMinutes(30);

            if (scheduledTime.isBefore(minimumAllowed)) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Sessions must be scheduled at least 30 minutes in advance");
            }

            booking.setScheduledAt(scheduledTime);
        }

        booking.setTotalCredits(totalCredits);
        booking.setStatus(BookingStatus.pending);

        Booking saved = bookingRepository.save(booking);

        Transaction tx = new Transaction();
        tx.setSenderId(currentUser.getId());
        tx.setReceiverId(skill.getOwner().getId());
        tx.setAmount(totalCredits);
        tx.setType("escrow_hold");
        transactionRepository.save(tx);

        return toResponseDTO(saved);
    }

    // COMPLETE
    @Transactional
    public BookingResponseDTO completeBooking(@NonNull Long bookingId, User currentUser) {
        Booking booking = getOrThrow(bookingId);

        if (!booking.getTeacherId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only teacher can mark complete");
        }

        if (booking.getStatus() != BookingStatus.pending) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking not in pending state");
        }

        if (booking.getScheduledAt() != null) {

    LocalDateTime sessionEnd =
            booking.getScheduledAt()
                    .plusHours(booking.getHours());

if (LocalDateTime.now(ZoneId.of("Asia/Kolkata"))
        .isBefore(sessionEnd)) {

    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Session cannot be completed before scheduled time ends"
    );
}
}

        booking.setStatus(BookingStatus.teacher_marked_complete);
        booking.setTeacherCompletedAt(LocalDateTime.now());

        return toResponseDTO(bookingRepository.save(booking));
    }

    // CONFIRM
    @SuppressWarnings("null")
    @Transactional
    public BookingResponseDTO confirmBooking(Long bookingId, User currentUser) {
        Booking booking = getOrThrow(bookingId);

        if (!booking.getLearnerId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only learner can confirm");
        }

        if (booking.getStatus() != BookingStatus.teacher_marked_complete) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking not ready");
        }

        User teacher = userRepository.findById(booking.getTeacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        teacher.setCredits(teacher.getCredits() + booking.getTotalCredits());
        userRepository.save(teacher);

        booking.setStatus(BookingStatus.completed);
        booking.setLearnerConfirmedAt(LocalDateTime.now());
        booking.setEscrowReleasedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        Transaction tx = new Transaction();
        tx.setSenderId(booking.getLearnerId());
        tx.setReceiverId(booking.getTeacherId());
        tx.setAmount(booking.getTotalCredits());
        tx.setType("escrow_release");
        transactionRepository.save(tx);

        return toResponseDTO(booking);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoCompleteExpiredBookings() {

        List<Booking> bookings = bookingRepository.findByStatus(
                BookingStatus.teacher_marked_complete);

        for (Booking booking : bookings) {

            if (booking.getTeacherCompletedAt() == null) {
                continue;
            }

            LocalDateTime expiry = booking.getTeacherCompletedAt().plusHours(24);

            if (LocalDateTime.now().isAfter(expiry)) {

                Long teacherId = booking.getTeacherId();
                if (teacherId == null) {
                    continue;
                }

                User teacher = userRepository
                        .findById(teacherId)
                        .orElse(null);

                if (teacher == null) {
                    continue;
                }

                userRepository.save(teacher);

                booking.setStatus(BookingStatus.completed);
                booking.setEscrowReleasedAt(LocalDateTime.now());

                bookingRepository.save(booking);

                Transaction tx = new Transaction();

                tx.setSenderId(booking.getLearnerId());
                tx.setReceiverId(booking.getTeacherId());
                tx.setAmount(booking.getTotalCredits());
                tx.setType("auto_escrow_release");

                transactionRepository.save(tx);
            }
        }
    }

    // CANCEL
    @SuppressWarnings("null")
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, User currentUser) {
        Booking booking = getOrThrow(bookingId);

        if (!booking.getLearnerId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only learner can cancel");
        }

        if (booking.getStatus() != BookingStatus.pending) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending bookings can be cancelled");
        }

        User learner = userRepository.findById(booking.getLearnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner not found"));

        learner.setCredits(learner.getCredits() + booking.getTotalCredits());
        userRepository.save(learner);

        booking.setStatus(BookingStatus.cancelled);
        bookingRepository.save(booking);

        Transaction tx = new Transaction();
        tx.setSenderId(booking.getTeacherId());
        tx.setReceiverId(booking.getLearnerId());
        tx.setAmount(booking.getTotalCredits());
        tx.setType("refund");
        transactionRepository.save(tx);

        return toResponseDTO(booking);
    }

    private Booking getOrThrow(@NonNull Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();

        dto.setId(booking.getId());
        dto.setHours(booking.getHours());
        dto.setTotalCredits(booking.getTotalCredits());
        dto.setStatus(booking.getStatus().name());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setScheduledAt(booking.getScheduledAt());
        dto.setMeetingLink(booking.getMeetingLink());

        Skill skill = booking.getSkill();
        User owner = skill.getOwner();

        dto.setSkill(new BookingResponseDTO.SkillMini(
                skill.getId(),
                skill.getTitle(),
                skill.getCategory(),
                skill.getCreditsPerHour(),
                owner.getName(),
                owner.getRatingCount() > 0
                        ? (double) owner.getRatingTotal() / owner.getRatingCount()
                        : 0.0));

        Long learnerId = booking.getLearnerId();
        if (learnerId != null) {
            User learner = userRepository.findById(learnerId).orElse(null);
            if (learner != null) {
                dto.setLearner(new BookingResponseDTO.UserMini(learner.getId(), learner.getName()));
            }
        }

        Long teacherId = booking.getTeacherId();
        if (teacherId != null) {
            User teacher = userRepository.findById(teacherId).orElse(null);
            if (teacher != null) {
                dto.setTeacher(new BookingResponseDTO.UserMini(teacher.getId(), teacher.getName()));
            }
        }

        dto.setHasDispute(disputeRepository.existsByBookingId(booking.getId()));

        return dto;
    }
}