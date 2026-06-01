package com.skillexchange.service;

import com.skillexchange.dto.CreditTransferRequestDTO;
import com.skillexchange.dto.TransactionResponseDTO;
import com.skillexchange.entity.Transaction;
import com.skillexchange.entity.User;
import com.skillexchange.repository.TransactionRepository;
import com.skillexchange.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CreditService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public CreditService(UserRepository userRepository,
            TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // POST /credits/transfer
    @Transactional
    public TransactionResponseDTO transfer(CreditTransferRequestDTO request, User currentUser) {

        // credit_service.py: if amount <= 0 → 400
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        }

        // receiver = db.query(User).filter(User.email == request.receiver_email)
        User receiver = userRepository.findByEmail(request.getReceiverEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

        // if receiver.id == current_user.id → 400
        if (receiver.getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer to yourself");
        }

        // credit_service.py: if sender.credits < amount → 400
        if (currentUser.getCredits() < request.getAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient credits");
        }

        currentUser.setCredits(currentUser.getCredits() - request.getAmount());
        receiver.setCredits(receiver.getCredits() + request.getAmount());

        userRepository.save(currentUser);
        userRepository.save(receiver);

        // transaction_type="manual_transfer"
        Transaction tx = new Transaction();
        tx.setSenderId(currentUser.getId());
        tx.setReceiverId(receiver.getId());
        tx.setAmount(request.getAmount());
        tx.setType("manual_transfer");
        Transaction saved = transactionRepository.save(tx);

        return toResponseDTO(saved);
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