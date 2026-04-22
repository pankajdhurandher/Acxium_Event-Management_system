package com.techmart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Submitted by user on the Request Item page. Directed to vendors. */
@Data @NoArgsConstructor @AllArgsConstructor
public class ItemRequestDto {
    private Long userId;
    private String itemName;
    private String description;
}
