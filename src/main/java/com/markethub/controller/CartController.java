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

import com.markethub.dto.AddToCartRequest;
import com.markethub.dto.CartItemResponse;
import com.markethub.dto.UpdateCartItemRequest;
import com.markethub.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public CartItemResponse addToCart(@Valid @RequestBody AddToCartRequest request) {
        return cartService.addToCart(request);
    }

    @GetMapping("/me")
    public List<CartItemResponse> getMyCart() {
        return cartService.getMyCart();
    }

    @PutMapping("/items/{cartItemId}")
    public CartItemResponse updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateCartItem(cartItemId, request);
    }

    @DeleteMapping("/items/{cartItemId}")
    public void removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
    }

    @DeleteMapping("/me")
    public void clearMyCart() {
        cartService.clearMyCart();
    }
}