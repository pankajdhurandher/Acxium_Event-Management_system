package com.techmart.repository;

import com.techmart.entity.Order;
import com.techmart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // All orders placed by a specific user (User Order Status page)
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // All orders for admin monitoring
    List<Order> findAllByOrderByCreatedAtDesc();
}
