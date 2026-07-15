package com.markethub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SellerOrderItemResponse {

    private Long orderId;
    private Long customerId;
    private String customerUsername;

    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal subtotal;

    private LocalDateTime createdAt;
}