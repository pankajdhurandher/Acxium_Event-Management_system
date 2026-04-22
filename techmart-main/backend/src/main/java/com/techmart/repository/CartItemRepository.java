package com.techmart.repository;

import com.techmart.entity.CartItem;
import com.techmart.entity.User;
import com.techmart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Get all cart items for a user
    List<CartItem> findByUser(User user);

    // Check if a product is already in the user's cart
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    // Remove all cart items for a user (after checkout)
    void deleteByUser(User user);
}
