package com.skillexchange.repository;

import com.skillexchange.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    boolean existsByBookingId(Long bookingId);

    List<Dispute> findByRaisedBy(Long userId);

    // Needed to enforce one-dispute-per-booking check
    Optional<Dispute> findByBookingId(Long bookingId);

}