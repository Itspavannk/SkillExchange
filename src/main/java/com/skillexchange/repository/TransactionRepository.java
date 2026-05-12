package com.skillexchange.repository;

import com.skillexchange.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderId(Long senderId);

    List<Transaction> findByReceiverId(Long receiverId);

    // filter(sender_id == id | receiver_id == id).order_by(created_at.desc())
    @Query("SELECT t FROM Transaction t WHERE t.senderId = :userId OR t.receiverId = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findByUser(@Param("userId") Long userId);
}