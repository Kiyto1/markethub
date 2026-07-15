package com.markethub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.markethub.dto.CreateProductRequest;
import com.markethub.dto.ProductResponse;
import com.markethub.dto.UpdateProductRequest;
import com.markethub.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/mine")
    public List<ProductResponse> getMyProducts() {
        return productService.getMyProducts();
    }

    @PostMapping
    public ProductResponse createProduct(@Valid @RequestBody CreateProductRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return productService.updateProduct(productId, request);
    }

    @DeleteMapping("/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
    }
}