package com.techmart.repository;

import com.techmart.entity.Product;
import com.techmart.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products for a specific vendor (Vendor Dashboard)
    List<Product> findByVendor(Vendor vendor);

    // Search products by name (User portal browse)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Filter by category (User portal dropdown)
    List<Product> findByCategory(String category);
}
