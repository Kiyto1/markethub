package com.markethub.controller;

import com.markethub.dto.SellerOrderItemResponse;
import com.markethub.service.SellerOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    public SellerOrderController(SellerOrderService sellerOrderService) {
        this.sellerOrderService = sellerOrderService;
    }

    @GetMapping("/sold-items")
    public List<SellerOrderItemResponse> getMySoldItems() {
        return sellerOrderService.getMySoldItems();
    }
}