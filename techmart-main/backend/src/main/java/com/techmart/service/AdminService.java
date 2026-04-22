package com.techmart.service;

import com.techmart.dto.ApiResponse;
import com.techmart.entity.User;
import com.techmart.entity.Vendor;
import com.techmart.repository.OrderRepository;
import com.techmart.repository.ProductRepository;
import com.techmart.repository.UserRepository;
import com.techmart.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminService handles:
 *  - View all users    (Maintain User sheet)
 *  - Delete a user
 *  - View all vendors  (Maintain Vendor sheet)
 *  - Delete a vendor
 *  - System stats      (Admin dashboard sheet)
 */
@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private VendorRepository vendorRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;

    // ── GET ALL USERS (Maintain User sheet) ───────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.USER)
                .toList();
    }

    // ── DELETE USER ───────────────────────────────────────────────────────────
    public ApiResponse deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            return new ApiResponse(false, "User not found.");
        }
        userRepository.deleteById(userId);
        return new ApiResponse(true, "User deleted.");
    }

    // ── GET ALL VENDORS (Maintain Vendor sheet) ───────────────────────────────
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // ── DELETE VENDOR ─────────────────────────────────────────────────────────
    public ApiResponse deleteVendor(Long vendorId) {
        if (!vendorRepository.existsById(vendorId)) {
            return new ApiResponse(false, "Vendor not found.");
        }
        vendorRepository.deleteById(vendorId);
        return new ApiResponse(true, "Vendor deleted.");
    }

    // ── SYSTEM STATS (Admin dashboard) ────────────────────────────────────────
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers",    (long) userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.USER).count());
        stats.put("totalVendors",  vendorRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders",   orderRepository.count());
        return stats;
    }
}
