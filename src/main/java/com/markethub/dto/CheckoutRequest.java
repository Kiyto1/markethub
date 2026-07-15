package com.markethub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;
}