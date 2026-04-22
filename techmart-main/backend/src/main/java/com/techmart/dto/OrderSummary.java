package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/** Full order details shown on the Order Status page (User and Admin). */
@Data @NoArgsConstructor @AllArgsConstructor
public class OrderSummary {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String address;
    private String createdAt;
    private String userName;
    private List<OrderItemDetail> items;
}
