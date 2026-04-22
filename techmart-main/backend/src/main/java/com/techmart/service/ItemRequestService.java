package com.techmart.service;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.ItemRequestDto;
import com.techmart.entity.ItemRequest;
import com.techmart.entity.User;
import com.techmart.repository.ItemRequestRepository;
import com.techmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ItemRequestService handles:
 *  - User submits a request for a new item  (Request Item sheet)
 *  - Vendor views all open requests         (Vendor Page / Product Status)
 *  - Vendor marks request as SEEN or FULFILLED
 */
@Service
public class ItemRequestService {

    @Autowired private ItemRequestRepository itemRequestRepository;
    @Autowired private UserRepository userRepository;

    // ── USER: SUBMIT REQUEST (Request Item sheet) ─────────────────────────────
    public ApiResponse submitRequest(ItemRequestDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (user == null) return new ApiResponse(false, "User not found.");

        ItemRequest request = new ItemRequest();
        request.setUser(user);
        request.setItemName(dto.getItemName());
        request.setDescription(dto.getDescription());
        request.setStatus(ItemRequest.RequestStatus.OPEN);

        itemRequestRepository.save(request);
        return new ApiResponse(true, "Request submitted. Vendors will be notified.");
    }

    // ── VENDOR: VIEW ALL OPEN REQUESTS ────────────────────────────────────────
    public List<ItemRequest> getAllRequests() {
        return itemRequestRepository.findAll();
    }

    // ── VENDOR: VIEW ONLY OPEN REQUESTS ──────────────────────────────────────
    public List<ItemRequest> getOpenRequests() {
        return itemRequestRepository.findByStatus(ItemRequest.RequestStatus.OPEN);
    }

    // ── VENDOR: UPDATE REQUEST STATUS ─────────────────────────────────────────
    public ApiResponse updateRequestStatus(Long requestId, String status) {
        ItemRequest request = itemRequestRepository.findById(requestId).orElse(null);
        if (request == null) return new ApiResponse(false, "Request not found.");

        try {
            ItemRequest.RequestStatus newStatus =
                    ItemRequest.RequestStatus.valueOf(status.toUpperCase());
            request.setStatus(newStatus);
            itemRequestRepository.save(request);
            return new ApiResponse(true, "Request status updated to " + newStatus + ".");
        } catch (Exception e) {
            return new ApiResponse(false, "Invalid status. Use: OPEN, SEEN, FULFILLED");
        }
    }

    // ── USER: VIEW OWN REQUESTS ───────────────────────────────────────────────
    public List<ItemRequest> getUserRequests(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return itemRequestRepository.findByUser(user);
    }
}
