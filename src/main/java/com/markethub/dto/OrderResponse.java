package com.markethub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.markethub.entity.OrderStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {

    private Long id;
    private Long customerId;
    private String customerUsername;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}