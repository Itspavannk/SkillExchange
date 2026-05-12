package com.skillexchange.repository;

import com.skillexchange.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByLearnerId(Long learnerId);

    List<Booking> findByTeacherId(Long teacherId);

    List<Booking> findByStatus(Booking.BookingStatus status);

}