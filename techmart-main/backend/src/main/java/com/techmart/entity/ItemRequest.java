package com.techmart.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a user's request for a new item/product.
 * Corresponds to the "Request Item" sheet in the Excel file,
 * where requests are directed to vendors.
 */
@Entity
@Table(name = "item_requests")
@Data
@NoArgsConstructor
public class ItemRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Which user made the request */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * OPEN     – newly submitted
     * SEEN     – vendor has seen it
     * FULFILLED – vendor added the product
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RequestStatus { OPEN, SEEN, FULFILLED }
}
