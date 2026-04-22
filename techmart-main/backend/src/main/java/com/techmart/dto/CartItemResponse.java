package com.techmart.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** One cart row shown on the Cart page. */
@Data @NoArgsConstructor
public class CartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemResponse(Long cartItemId, Long productId, String productName,
                            BigDecimal price, Integer quantity) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }
}
