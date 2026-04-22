package com.techmart.repository;

import com.techmart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository – Spring Data JPA provides all basic CRUD automatically.
 * We only declare custom query methods here.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // Used during login to find user by email
    Optional<User> findByEmail(String email);

    // Check if email is already registered
    boolean existsByEmail(String email);
}
