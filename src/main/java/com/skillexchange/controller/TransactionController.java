package com.skillexchange.controller;

import com.skillexchange.dto.TransactionResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.TransactionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // GET /transactions/me — current user only, ordered by date desc
    @GetMapping("/me")
    public List<TransactionResponseDTO> myTransactions(@AuthenticationPrincipal User currentUser) {
        return transactionService.getUserTransactions(currentUser.getId());
    }
}