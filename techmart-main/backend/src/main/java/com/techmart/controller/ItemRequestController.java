package com.techmart.controller;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.ItemRequestDto;
import com.techmart.entity.ItemRequest;
import com.techmart.service.ItemRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class ItemRequestController {

    @Autowired
    private ItemRequestService itemRequestService;

    @PostMapping
    public ApiResponse submit(@RequestBody ItemRequestDto dto) {
        return itemRequestService.submitRequest(dto);
    }

    @GetMapping("/all")
    public List<ItemRequest> all() {
        return itemRequestService.getAllRequests();
    }

    @GetMapping("/open")
    public List<ItemRequest> open() {
        return itemRequestService.getOpenRequests();
    }

    @GetMapping("/user/{userId}")
    public List<ItemRequest> userRequests(@PathVariable Long userId) {
        return itemRequestService.getUserRequests(userId);
    }

    @PutMapping("/{id}/status")
    public ApiResponse updateStatus(@PathVariable Long id, @RequestParam String s) {
        return itemRequestService.updateRequestStatus(id, s);
    }
}
