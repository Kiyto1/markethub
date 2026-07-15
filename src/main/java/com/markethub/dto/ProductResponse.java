package com.markethub.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private double price;
    private int quantity;

    private Long sellerId;
    private String sellerUsername;
}