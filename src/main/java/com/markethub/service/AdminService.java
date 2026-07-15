package com.markethub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.markethub.dto.ProductResponse;
import com.markethub.dto.UserResponse;
import com.markethub.entity.Product;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.repository.ProductRepository;
import com.markethub.repository.UserRepository;
import com.markethub.security.CurrentUserService;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public AdminService(
            UserRepository userRepository,
            ProductRepository productRepository,
            CurrentUserService currentUserService
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    public List<UserResponse> getAllUsers() {
        requireAdmin();

        return userRepository.findAll()
                .stream()
                .map(this::mapUserToResponse)
                .toList();
    }

    public List<UserResponse> getUsersByRole(Role role) {
        requireAdmin();

        return userRepository.findByRole(role)
                .stream()
                .map(this::mapUserToResponse)
                .toList();
    }

    public UserResponse activateUser(Long userId) {
        requireAdmin();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);

        return mapUserToResponse(userRepository.save(user));
    }

    public UserResponse deactivateUser(Long userId) {
        requireAdmin();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);

        return mapUserToResponse(userRepository.save(user));
    }

    public List<ProductResponse> getAllProducts() {
        requireAdmin();

        return productRepository.findAll()
                .stream()
                .map(this::mapProductToResponse)
                .toList();
    }

    public void deleteProduct(Long productId) {
        requireAdmin();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
    }

    private void requireAdmin() {
        User user = currentUserService.getCurrentUser();

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admins can access this resource");
        }
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }

    private ProductResponse mapProductToResponse(Product product) {
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