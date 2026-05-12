package com.skillexchange.dto;

// CreditTransferRequest schema — receiver by EMAIL not ID
public class CreditTransferRequestDTO {

    private String receiverEmail;
    private Integer amount;

    public CreditTransferRequestDTO() {}

    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
}