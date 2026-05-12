package com.skillexchange.controller;

import com.skillexchange.dto.DisputeCreateDTO;
import com.skillexchange.dto.DisputeResponseDTO;
import com.skillexchange.entity.User;
import com.skillexchange.service.DisputeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disputes")
public class DisputeController {

    private final DisputeService disputeService;

    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    // POST /disputes/{booking_id}
    @PostMapping("/{bookingId}")
    public DisputeResponseDTO raiseDispute(@PathVariable Long bookingId,
                                           @RequestBody DisputeCreateDTO data,
                                           @AuthenticationPrincipal User currentUser) {
        return disputeService.raiseDispute(bookingId, data, currentUser);
    }

    // GET /disputes/me
    @GetMapping("/me")
    public List<DisputeResponseDTO> myDisputes(@AuthenticationPrincipal User currentUser) {
        return disputeService.myDisputes(currentUser.getId());
    }

    // GET /disputes/admin — admin only (guarded by SecurityConfig)
    @GetMapping("/admin")
    public List<DisputeResponseDTO> allDisputes() {
        return disputeService.allDisputes();
    }

    // POST /disputes/admin/{id}/resolve — admin only
    // refund=true → deduct teacher, refund learner; refund=false → mark completed
    @PostMapping("/admin/{id}/resolve")
    public DisputeResponseDTO resolveDispute(@PathVariable Long id,
                                             @RequestParam(defaultValue = "false") boolean refund,
                                             @RequestParam(required = false) String adminNote) {
        return disputeService.resolveDispute(id, refund, adminNote);
    }
}