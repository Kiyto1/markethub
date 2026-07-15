package com.markethub.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WalletResponse {

    private Long walletId;
    private Long customerId;
    private String customerUsername;
    private BigDecimal balance;
}