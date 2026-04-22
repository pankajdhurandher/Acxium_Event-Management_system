package com.techmart.service;

import com.techmart.dto.*;
import com.techmart.entity.User;
import com.techmart.entity.Vendor;
import com.techmart.repository.UserRepository;
import com.techmart.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService handles:
 *  - Admin login  (Admin Login sheet)
 *  - Admin signup (Admin Signup sheet)
 *  - User login   (User Login sheet)
 *  - User signup  (User SignUp sheet)
 *  - Vendor login (Vendor Login sheet)
 *  - Vendor reg   (Vendor sheet)
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── USER SIGNUP ───────────────────────────────────────────────────────────

    public ApiResponse userSignup(UserSignupRequest req) {
        // Check if email already taken
        if (userRepository.existsByEmail(req.getEmail())) {
            return new ApiResponse(false, "Email already registered.");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // hash password
        user.setRole(User.Role.USER);

        userRepository.save(user);
        return new ApiResponse(true, "User registered successfully.");
    }

    // ── USER / ADMIN LOGIN ────────────────────────────────────────────────────

    public ApiResponse userLogin(LoginRequest req) {
        // Find user by email
        User user = userRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (user == null) {
            return new ApiResponse(false, "No account found with this email.");
        }

        // Verify password
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return new ApiResponse(false, "Incorrect password.");
        }

        // Return user info to frontend (frontend stores in localStorage)
        LoginResponse resp = new LoginResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().name()   // "USER" or "ADMIN"
        );
        return new ApiResponse(true, "Login successful.", resp);
    }

    // ── ADMIN SIGNUP ──────────────────────────────────────────────────────────

    public ApiResponse adminSignup(UserSignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return new ApiResponse(false, "Email already registered.");
        }

        User admin = new User();
        admin.setName(req.getName());
        admin.setEmail(req.getEmail());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setRole(User.Role.ADMIN);  // force ADMIN role

        userRepository.save(admin);
        return new ApiResponse(true, "Admin account created successfully.");
    }

    // ── VENDOR SIGNUP ─────────────────────────────────────────────────────────

    public ApiResponse vendorSignup(VendorSignupRequest req) {
        if (vendorRepository.existsByEmail(req.getEmail())) {
            return new ApiResponse(false, "Email already registered.");
        }

        Vendor vendor = new Vendor();
        vendor.setBusinessName(req.getBusinessName());
        vendor.setEmail(req.getEmail());
        vendor.setPassword(passwordEncoder.encode(req.getPassword()));
        vendor.setPhone(req.getPhone());

        vendorRepository.save(vendor);
        return new ApiResponse(true, "Vendor registered successfully.");
    }

    // ── VENDOR LOGIN ──────────────────────────────────────────────────────────

    public ApiResponse vendorLogin(LoginRequest req) {
        Vendor vendor = vendorRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (vendor == null) {
            return new ApiResponse(false, "No vendor account found.");
        }

        if (!passwordEncoder.matches(req.getPassword(), vendor.getPassword())) {
            return new ApiResponse(false, "Incorrect password.");
        }

        LoginResponse resp = new LoginResponse(
                vendor.getId(), vendor.getBusinessName(),
                vendor.getEmail(), "VENDOR"
        );
        return new ApiResponse(true, "Login successful.", resp);
    }
}
