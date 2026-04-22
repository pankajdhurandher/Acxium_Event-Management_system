package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/** Request body sent from the Checkout page. paymentMethod = "CASH" or "UPI". */
@Data @NoArgsConstructor @AllArgsConstructor
public class CheckoutRequest {
    private Long userId;
    private String address;
    private String paymentMethod;   // "CASH" or "UPI"
}
