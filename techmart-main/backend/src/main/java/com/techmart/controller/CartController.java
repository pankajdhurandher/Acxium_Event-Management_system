package com.techmart.controller;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.CartItemResponse;
import com.techmart.dto.CartRequest;
import com.techmart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public List<CartItemResponse> getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/add")
    public ApiResponse addToCart(@RequestBody CartRequest req) {
        return cartService.addToCart(req);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ApiResponse removeItem(@PathVariable Long cartItemId) {
        return cartService.removeFromCart(cartItemId);
    }
}
