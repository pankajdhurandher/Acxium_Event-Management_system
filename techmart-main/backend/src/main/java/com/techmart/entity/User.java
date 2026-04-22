package com.techmart.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a User or Admin in the system.
 * Role field distinguishes between the two.
 */
@Entity
@Table(name = "users")
@Data                   // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor      // Lombok: generates no-arg constructor (required by JPA)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;   // stored as BCrypt hash

    /**
     * ADMIN – can manage users and vendors
     * USER  – can browse, cart, checkout, request items
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { ADMIN, USER }
}
