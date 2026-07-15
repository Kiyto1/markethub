package com.markethub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.markethub.dto.AddWalletFundsRequest;
import com.markethub.dto.WalletResponse;
import com.markethub.service.WalletService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/me")
    public WalletResponse getMyWallet() {
        return walletService.getMyWallet();
    }

    @PostMapping("/me/funds")
    public WalletResponse addFunds(@Valid @RequestBody AddWalletFundsRequest request) {
        return walletService.addFunds(request);
    }
}