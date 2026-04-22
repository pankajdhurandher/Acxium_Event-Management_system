package com.techmart.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

/** Request body for adding or updating a product (Vendor – Add Item screen). */
@Data @NoArgsConstructor @AllArgsConstructor
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
}
