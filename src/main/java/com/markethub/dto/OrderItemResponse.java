package com.markethub.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {

    private Long productId;
    private String productName;
    private String sellerUsername;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal subtotal;
}