package com.markethub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.markethub.dto.CreateProductRequest;
import com.markethub.dto.ProductResponse;
import com.markethub.dto.UpdateProductRequest;
import com.markethub.entity.Product;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.repository.ProductRepository;
import com.markethub.security.CurrentUserService;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public ProductService(
            ProductRepository productRepository,
            CurrentUserService currentUserService
    ) {
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductResponse> getMyProducts() {
        User seller = currentUserService.getCurrentUser();

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can view their products");
        }

        return productRepository.findBySellerId(seller.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToResponse(product);
    }

    public ProductResponse createProduct(CreateProductRequest request) {
        User seller = currentUserService.getCurrentUser();

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can create products");
        }

        if (!seller.isActive()) {
            throw new RuntimeException("Seller account is not active");
        }

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .seller(seller)
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long productId, UpdateProductRequest request) {
        User seller = currentUserService.getCurrentUser();

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can update products");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You are not allowed to update this product");
        }

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    public void deleteProduct(Long productId) {
        User seller = currentUserService.getCurrentUser();

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can delete products");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You are not allowed to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .sellerId(product.getSeller().getId())
                .sellerUsername(product.getSeller().getUsername())
                .build();
    }
}