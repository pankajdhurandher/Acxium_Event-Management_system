package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Request to add a product to the cart. */
@Data @NoArgsConstructor @AllArgsConstructor
public class CartRequest {
    private Long userId;
    private Long productId;
    private Integer quantity;
}
