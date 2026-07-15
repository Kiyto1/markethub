package com.markethub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.markethub.dto.AddToCartRequest;
import com.markethub.dto.CartItemResponse;
import com.markethub.dto.UpdateCartItemRequest;
import com.markethub.entity.CartItem;
import com.markethub.entity.Product;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.repository.CartItemRepository;
import com.markethub.repository.ProductRepository;
import com.markethub.security.CurrentUserService;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            CurrentUserService currentUserService
    ) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    public CartItemResponse addToCart(AddToCartRequest request) {
        User customer = getCurrentCustomer();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getQuantity() > product.getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        CartItem cartItem = cartItemRepository
                .findByCustomerIdAndProductId(customer.getId(), product.getId())
                .map(existingItem -> {
                    int newQuantity = existingItem.getQuantity() + request.getQuantity();

                    if (newQuantity > product.getQuantity()) {
                        throw new RuntimeException("Requested quantity exceeds available stock");
                    }

                    existingItem.setQuantity(newQuantity);
                    return existingItem;
                })
                .orElseGet(() -> CartItem.builder()
                        .customer(customer)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        CartItem savedItem = cartItemRepository.save(cartItem);

        return mapToResponse(savedItem);
    }

    public List<CartItemResponse> getMyCart() {
        User customer = getCurrentCustomer();

        return cartItemRepository.findByCustomer(customer)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CartItemResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
        User customer = getCurrentCustomer();

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("You are not allowed to update this cart item");
        }

        Product product = cartItem.getProduct();

        if (request.getQuantity() > product.getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        cartItem.setQuantity(request.getQuantity());

        CartItem savedItem = cartItemRepository.save(cartItem);

        return mapToResponse(savedItem);
    }

    public void removeCartItem(Long cartItemId) {
        User customer = getCurrentCustomer();

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("You are not allowed to remove this cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clearMyCart() {
        User customer = getCurrentCustomer();

        List<CartItem> cartItems = cartItemRepository.findByCustomer(customer);

        cartItemRepository.deleteAll(cartItems);
    }

    private User getCurrentCustomer() {
        User customer = currentUserService.getCurrentUser();

        if (customer.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("Only customers can access cart");
        }

        if (!customer.isActive()) {
            throw new RuntimeException("Customer account is not active");
        }

        return customer;
    }

    private CartItemResponse mapToResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .unitPrice(product.getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(product.getPrice() * cartItem.getQuantity())
                .build();
    }
}