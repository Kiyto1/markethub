package com.markethub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.markethub.dto.OrderResponse;
import com.markethub.service.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping
    public OrderResponse checkout() {
        return checkoutService.checkout();
    }

    @GetMapping("/orders/me")
    public List<OrderResponse> getMyOrders() {
        return checkoutService.getMyOrders();
    }
}