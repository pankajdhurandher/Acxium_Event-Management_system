package com.techmart.controller;

import com.techmart.dto.ApiResponse;
import com.techmart.entity.User;
import com.techmart.entity.Vendor;
import com.techmart.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public List<User> allUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }

    @GetMapping("/vendors")
    public List<Vendor> allVendors() {
        return adminService.getAllVendors();
    }

    @DeleteMapping("/vendors/{id}")
    public ApiResponse deleteVendor(@PathVariable Long id) {
        return adminService.deleteVendor(id);
    }
}
