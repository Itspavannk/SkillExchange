package com.skillexchange.controller;

import com.skillexchange.entity.Booking;
import com.skillexchange.entity.Transaction;
import com.skillexchange.entity.User;
import com.skillexchange.service.AdminService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
// All /admin/** routes require ROLE_ADMIN — enforced in SecurityConfig
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET /admin/users
    @GetMapping("/users")
    public List<User> users() {
        return adminService.allUsers();
    }

    // GET /admin/bookings
    @GetMapping("/bookings")
    public List<Booking> bookings() {
        return adminService.allBookings();
    }

    // GET /admin/transactions
    @GetMapping("/transactions")
    public List<Transaction> transactions() {
        return adminService.allTransactions();
    }

    // POST /admin/grant-credits — with reason param and transaction log
    @PostMapping("/grant-credits")
    public Map<String, Object> grantCredits(@RequestParam Long userId,
            @RequestParam Integer amount,
            @RequestParam String reason,
            @AuthenticationPrincipal User admin) {
        return adminService.grantCredits(userId, amount, reason, admin);
    }
}