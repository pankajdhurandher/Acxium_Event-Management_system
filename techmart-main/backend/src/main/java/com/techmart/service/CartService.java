package com.techmart.service;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.CartItemResponse;
import com.techmart.dto.CartRequest;
import com.techmart.entity.CartItem;
import com.techmart.entity.Product;
import com.techmart.entity.User;
import com.techmart.repository.CartItemRepository;
import com.techmart.repository.ProductRepository;
import com.techmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * CartService handles:
 *  - Add to cart   (User clicks "Add to Cart" on Products page)
 *  - View cart     (Cart sheet)
 *  - Remove item
 *  - Clear cart    (called after checkout)
 */
@Service
public class CartService {

    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // ── ADD ITEM TO CART ──────────────────────────────────────────────────────
    public ApiResponse addToCart(CartRequest req) {
        User user = userRepository.findById(req.getUserId()).orElse(null);
        if (user == null) return new ApiResponse(false, "User not found.");

        Product product = productRepository.findById(req.getProductId()).orElse(null);
        if (product == null) return new ApiResponse(false, "Product not found.");

        if (product.getStock() < req.getQuantity()) {
            return new ApiResponse(false, "Not enough stock available.");
        }

        // If product already in cart → update quantity
        Optional<CartItem> existing = cartItemRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            cartItemRepository.save(item);
        }

        return new ApiResponse(true, "Item added to cart.");
    }

    // ── VIEW CART (Cart sheet) ────────────────────────────────────────────────
    public List<CartItemResponse> getCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return cartItemRepository.findByUser(user).stream()
                .map(ci -> new CartItemResponse(
                        ci.getId(),
                        ci.getProduct().getId(),
                        ci.getProduct().getName(),
                        ci.getProduct().getPrice(),
                        ci.getQuantity()
                ))
                .collect(Collectors.toList());
    }

    // ── REMOVE ONE ITEM FROM CART ─────────────────────────────────────────────
    public ApiResponse removeFromCart(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            return new ApiResponse(false, "Cart item not found.");
        }
        cartItemRepository.deleteById(cartItemId);
        return new ApiResponse(true, "Item removed from cart.");
    }

    // ── CLEAR ENTIRE CART (called after successful checkout) ─────────────────
    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        cartItemRepository.deleteByUser(user);
    }
}
