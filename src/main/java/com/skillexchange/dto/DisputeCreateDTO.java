package com.skillexchange.dto;

import jakarta.validation.constraints.NotBlank;

// DisputeCreate schema
public class DisputeCreateDTO {

    @NotBlank(message = "Reason is required")
    private String reason;

    public DisputeCreateDTO() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}