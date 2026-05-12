package com.skillexchange.service;

import com.skillexchange.dto.TransactionResponseDTO;
import com.skillexchange.entity.Transaction;
import com.skillexchange.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // GET /transactions/me
    // Uses combined OR query ordered by created_at DESC
    public List<TransactionResponseDTO> getUserTransactions(Long userId) {
        return transactionRepository.findByUser(userId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO toResponseDTO(Transaction tx) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(tx.getId());
        dto.setSenderId(tx.getSenderId());
        dto.setReceiverId(tx.getReceiverId());
        dto.setAmount(tx.getAmount());
        dto.setType(tx.getType());
        dto.setCreatedAt(tx.getCreatedAt());
        return dto;
    }
}