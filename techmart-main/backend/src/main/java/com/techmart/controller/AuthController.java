package com.techmart.controller;

import com.techmart.dto.*;
import com.techmart.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── USER 

    @PostMapping("/user/signup")
    public ApiResponse userSignup(@RequestBody UserSignupRequest req) {
        return authService.userSignup(req);
    }

    @PostMapping("/user/login")
    public ApiResponse userLogin(@RequestBody LoginRequest req) {
        return authService.userLogin(req);
    }

    // ── ADMIN 

    @PostMapping("/admin/signup")
    public ApiResponse adminSignup(@RequestBody UserSignupRequest req) {
        return authService.adminSignup(req);
    }

    @PostMapping("/admin/login")
    public ApiResponse adminLogin(@RequestBody LoginRequest req) {
        // reuse userLogin — it returns the role field which will be "ADMIN"
        return authService.userLogin(req);
    }

    // ── VENDOR

    @PostMapping("/vendor/signup")
    public ApiResponse vendorSignup(@RequestBody VendorSignupRequest req) {
        return authService.vendorSignup(req);
    }

    @PostMapping("/vendor/login")
    public ApiResponse vendorLogin(@RequestBody LoginRequest req) {
        return authService.vendorLogin(req);
    }
}
