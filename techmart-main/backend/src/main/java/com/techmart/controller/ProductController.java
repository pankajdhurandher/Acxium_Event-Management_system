package com.techmart.controller;

import com.techmart.dto.ApiResponse;
import com.techmart.dto.ProductRequest;
import com.techmart.dto.ProductResponse;
import com.techmart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ── PUBLIC: USER BROWSING ─────────────────────────────────────────────────

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/search")
    public List<ProductResponse> search(@RequestParam String name) {
        return productService.searchProducts(name);
    }

    @GetMapping("/category")
    public List<ProductResponse> byCategory(@RequestParam String cat) {
        return productService.getProductsByCategory(cat);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ── VENDOR ────────────────────────────────────────────────────────────────

    @GetMapping("/vendor/{vendorId}")
    public List<ProductResponse> vendorProducts(@PathVariable Long vendorId) {
        return productService.getProductsByVendor(vendorId);
    }

    @PostMapping("/vendor/{vendorId}")
    public ApiResponse addProduct(@PathVariable Long vendorId,
                                  @RequestBody ProductRequest req) {
        return productService.addProduct(vendorId, req);
    }

    @PutMapping("/{productId}/vendor/{vendorId}")
    public ApiResponse updateProduct(@PathVariable Long productId,
                                     @PathVariable Long vendorId,
                                     @RequestBody ProductRequest req) {
        return productService.updateProduct(productId, vendorId, req);
    }

    @DeleteMapping("/{productId}/vendor/{vendorId}")
    public ApiResponse deleteProduct(@PathVariable Long productId,
                                     @PathVariable Long vendorId) {
        return productService.deleteProduct(productId, vendorId);
    }
}
