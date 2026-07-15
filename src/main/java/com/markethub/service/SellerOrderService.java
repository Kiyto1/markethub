package com.markethub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.markethub.dto.SellerOrderItemResponse;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.repository.OrderItemRepository;
import com.markethub.security.CurrentUserService;

@Service
public class SellerOrderService {

    private final OrderItemRepository orderItemRepository;
    private final CurrentUserService currentUserService;

    public SellerOrderService(
            OrderItemRepository orderItemRepository,
            CurrentUserService currentUserService
    ) {
        this.orderItemRepository = orderItemRepository;
        this.currentUserService = currentUserService;
    }

    public List<SellerOrderItemResponse> getMySoldItems() {
        User seller = currentUserService.getCurrentUser();

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can view sold items");
        }

        return orderItemRepository.findBySeller(seller)
                .stream()
                .map(item -> SellerOrderItemResponse.builder()
                        .orderId(item.getOrder().getId())
                        .customerId(item.getOrder().getCustomer().getId())
                        .customerUsername(item.getOrder().getCustomer().getUsername())
                        .productId(item.getProduct().getId())
                        .productName(item.getProductNameSnapshot())
                        .unitPrice(item.getUnitPriceSnapshot())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .createdAt(item.getOrder().getCreatedAt())
                        .build())
                .toList();
    }
}