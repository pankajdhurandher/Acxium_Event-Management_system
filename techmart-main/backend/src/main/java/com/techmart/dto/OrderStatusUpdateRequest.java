package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Vendor uses this to update an order's status (Update sheet – "State will Change"). */
@Data @NoArgsConstructor @AllArgsConstructor
public class OrderStatusUpdateRequest {
    private String status; // PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
}
