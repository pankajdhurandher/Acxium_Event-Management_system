package com.techmart.service;

import com.techmart.dto.*;
import com.techmart.entity.*;
import com.techmart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * OrderService handles:
 *  - Checkout: convert cart → order  (CheckOut sheet, Cash/UPI)
 *  - User views own orders           (Order Status(User) sheet)
 *  - Vendor updates order status     (Update sheet – "State will Change")
 *  - Admin views all orders          (Admin sheet)
 */
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // ── CHECKOUT (CheckOut sheet) ─────────────────────────────────────────────
    @Transactional
    public ApiResponse checkout(CheckoutRequest req) {
        User user = userRepository.findById(req.getUserId()).orElse(null);
        if (user == null) return new ApiResponse(false, "User not found.");

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) return new ApiResponse(false, "Your cart is empty.");

        // Validate payment method
        Order.PaymentMethod paymentMethod;
        try {
            paymentMethod = Order.PaymentMethod.valueOf(req.getPaymentMethod().toUpperCase());
        } catch (Exception e) {
            return new ApiResponse(false, "Invalid payment method. Use CASH or UPI.");
        }

        // Calculate total
        BigDecimal total = cartItems.stream()
                .map(ci -> ci.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setAddress(req.getAddress());

        // Create order items from cart
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            Product product = ci.getProduct();

            // Check stock
            if (product.getStock() < ci.getQuantity()) {
                return new ApiResponse(false,
                        "Insufficient stock for: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - ci.getQuantity());
            productRepository.save(product);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(product.getPrice());
            orderItems.add(oi);
        }

        order.setItems(orderItems);
        orderRepository.save(order);

        // Clear cart after successful checkout
        cartItemRepository.deleteByUser(user);

        return new ApiResponse(true, "Order placed successfully!", order.getId());
    }

    // ── USER: VIEW OWN ORDERS (Order Status(User) sheet) ─────────────────────
    public List<OrderSummary> getUserOrders(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    // ── VENDOR: UPDATE ORDER STATUS (Update sheet) ────────────────────────────
    @Transactional
    public ApiResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest req) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return new ApiResponse(false, "Order not found.");

        Order.OrderStatus previousStatus = order.getStatus();

        // Prevent updating a already-cancelled or delivered order
        if (previousStatus == Order.OrderStatus.CANCELLED) {
            return new ApiResponse(false, "Order is already cancelled.");
        }

        try {
            Order.OrderStatus newStatus =
                    Order.OrderStatus.valueOf(req.getStatus().toUpperCase());

            // ── STOCK RESTORATION ON CANCELLATION ────────────────────────────
            // If order is being cancelled AND it was not already cancelled,
            // give back the stock for every item in this order.
            if (newStatus == Order.OrderStatus.CANCELLED
                    && previousStatus != Order.OrderStatus.CANCELLED) {

                for (OrderItem oi : order.getItems()) {
                    Product product = oi.getProduct();
                    // Add back the quantity that was deducted at checkout
                    product.setStock(product.getStock() + oi.getQuantity());
                    productRepository.save(product);
                }
            }

            order.setStatus(newStatus);
            orderRepository.save(order);
            return new ApiResponse(true, "Order status updated to " + newStatus + "."
                    + (newStatus == Order.OrderStatus.CANCELLED
                       ? " Stock has been restored." : ""));

        } catch (Exception e) {
            return new ApiResponse(false,
                    "Invalid status. Use: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED");
        }
    }

    // ── ADMIN / VENDOR: GET ALL ORDERS ────────────────────────────────────────
    public List<OrderSummary> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    // ── GET SINGLE ORDER ──────────────────────────────────────────────────────
    public OrderSummary getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        return order == null ? null : toSummary(order);
    }

    // ── Helper: Order entity → OrderSummary DTO ───────────────────────────────
    private OrderSummary toSummary(Order order) {
        List<OrderItemDetail> items = order.getItems().stream()
                .map(oi -> new OrderItemDetail(
                        oi.getProduct().getName(),
                        oi.getQuantity(),
                        oi.getPrice(),
                        oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity()))
                ))
                .collect(Collectors.toList());

        return new OrderSummary(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getPaymentMethod().name(),
                order.getAddress(),
                order.getCreatedAt().toString(),
                order.getUser().getName(),
                items
        );
    }
}
