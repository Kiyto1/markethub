package com.markethub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @Positive(message = "Price must be greater than 0")
    private double price;

    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity;
}