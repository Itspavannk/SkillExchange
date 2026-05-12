package com.skillexchange.service;

import com.skillexchange.entity.Booking;
import com.skillexchange.entity.Transaction;
import com.skillexchange.entity.User;
import com.skillexchange.repository.BookingRepository;
import com.skillexchange.repository.TransactionRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(UserRepository userRepository,
                        BookingRepository bookingRepository,
                        TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.transactionRepository = transactionRepository;
    }

    // Get all users
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    // Get all bookings
    public List<Booking> allBookings() {
        return bookingRepository.findAll();
    }

    // Get all transactions
    public List<Transaction> allTransactions() {
        return transactionRepository.findAll();
    }

    // Grant credits to a user
    @Transactional
    public Map<String, Object> grantCredits(Long userId, Integer amount, String reason, User admin) {

        if (amount == null || amount <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Amount must be positive"
            );
        }

        User user = userRepository.findById(
                Objects.requireNonNull(userId, "User ID cannot be null")
        ).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        );

        // Add credits
        user.setCredits(user.getCredits() + amount);
        userRepository.save(user);

        // Log transaction
        Transaction tx = new Transaction();
        tx.setSenderId(admin.getId());
        tx.setReceiverId(user.getId());
        tx.setAmount(amount);
        tx.setType("admin_grant");

        transactionRepository.save(tx);

        return Map.of(
                "message", "Credits granted successfully",
                "user_id", user.getId(),
                "new_balance", user.getCredits()
        );
    }
}