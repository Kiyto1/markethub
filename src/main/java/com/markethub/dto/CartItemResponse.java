package com.markethub.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {

    private Long id;

    private Long productId;
    private String productName;
    private double unitPrice;

    private int quantity;
    private double subtotal;
}