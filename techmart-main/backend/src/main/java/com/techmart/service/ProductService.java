package com.techmart.service;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.ProductRequest;
import com.techmart.dto.ProductResponse;
import com.techmart.entity.Product;
import com.techmart.entity.Vendor;
import com.techmart.repository.ProductRepository;
import com.techmart.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductService handles:
 *  - Vendor adds a product      (Add Item sheet)
 *  - Vendor updates a product   (Vendor Page sheet)
 *  - Vendor deletes a product
 *  - User browses all products  (Products sheet)
 *  - User searches/filters      (User Portal dropdown)
 */
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // ── Helper: convert Product entity → ProductResponse DTO ─────────────────
    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(),
                p.getPrice(), p.getStock(), p.getCategory(),
                p.getVendor().getBusinessName(), p.getVendor().getId()
        );
    }

    // ── ADD PRODUCT (Vendor – Add Item screen) ────────────────────────────────
    public ApiResponse addProduct(Long vendorId, ProductRequest req) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElse(null);
        if (vendor == null) {
            return new ApiResponse(false, "Vendor not found.");
        }

        Product product = new Product();
        product.setVendor(vendor);
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setCategory(req.getCategory());

        productRepository.save(product);
        return new ApiResponse(true, "Product added successfully.", toResponse(product));
    }

    // ── UPDATE PRODUCT (Vendor – Vendor Page / manage products) ──────────────
    public ApiResponse updateProduct(Long productId, Long vendorId, ProductRequest req) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return new ApiResponse(false, "Product not found.");
        }
        // Security: only the owning vendor can update
        if (!product.getVendor().getId().equals(vendorId)) {
            return new ApiResponse(false, "Unauthorized: this product belongs to another vendor.");
        }

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setCategory(req.getCategory());

        productRepository.save(product);
        return new ApiResponse(true, "Product updated successfully.", toResponse(product));
    }

    // ── DELETE PRODUCT ────────────────────────────────────────────────────────
    public ApiResponse deleteProduct(Long productId, Long vendorId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return new ApiResponse(false, "Product not found.");
        }
        if (!product.getVendor().getId().equals(vendorId)) {
            return new ApiResponse(false, "Unauthorized.");
        }
        productRepository.delete(product);
        return new ApiResponse(true, "Product deleted.");
    }

    // ── GET ALL PRODUCTS FOR A VENDOR (Vendor Page listing) ──────────────────
    public List<ProductResponse> getProductsByVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId).orElseThrow();
        return productRepository.findByVendor(vendor)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── GET ALL PRODUCTS (User portal – Products sheet) ───────────────────────
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── SEARCH PRODUCTS BY NAME ───────────────────────────────────────────────
    public List<ProductResponse> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── FILTER BY CATEGORY (User Portal dropdown) ────────────────────────────
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── GET SINGLE PRODUCT ────────────────────────────────────────────────────
    public ProductResponse getProductById(Long id) {
        Product p = productRepository.findById(id).orElse(null);
        return p == null ? null : toResponse(p);
    }
}
