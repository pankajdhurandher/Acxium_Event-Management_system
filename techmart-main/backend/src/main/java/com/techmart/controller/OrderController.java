package com.techmart.controller;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.CheckoutRequest;
import com.techmart.dto.OrderStatusUpdateRequest;
import com.techmart.dto.OrderSummary;
import com.techmart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse checkout(@RequestBody CheckoutRequest req) {
        return orderService.checkout(req);
    }

    @GetMapping("/user/{userId}")
    public List<OrderSummary> userOrders(@PathVariable Long userId) {
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/all")
    public List<OrderSummary> allOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderId}")
    public OrderSummary getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse updateStatus(@PathVariable Long orderId,
                                    @RequestBody OrderStatusUpdateRequest req) {
        return orderService.updateOrderStatus(orderId, req);
    }
}
