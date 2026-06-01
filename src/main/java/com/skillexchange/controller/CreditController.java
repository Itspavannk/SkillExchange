package com.skillexchange.controller;

import com.skillexchange.dto.CreditTransferRequestDTO;
import com.skillexchange.dto.TransactionResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.CreditService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/credits")
public class CreditController {

    private final CreditService creditService;

    public CreditController(CreditService creditService) {
        this.creditService = creditService;
    }

    // POST /credits/transfer
    // Sender is always the authenticated user — receiver looked up by email
    @PostMapping("/transfer")
    public TransactionResponseDTO transfer(@RequestBody CreditTransferRequestDTO request,
            @AuthenticationPrincipal User currentUser) {
        return creditService.transfer(request, currentUser);
    }
}