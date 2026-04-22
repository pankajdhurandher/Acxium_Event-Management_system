package com.techmart.repository;

import com.techmart.entity.ItemRequest;
import com.techmart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRequestRepository extends JpaRepository<ItemRequest, Long> {

    // Requests made by a specific user
    List<ItemRequest> findByUser(User user);

    // All open requests – vendors can see these
    List<ItemRequest> findByStatus(ItemRequest.RequestStatus status);
}
