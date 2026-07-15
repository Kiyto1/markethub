package com.markethub.service;

import org.springframework.stereotype.Service;

import com.markethub.dto.AddWalletFundsRequest;
import com.markethub.dto.WalletResponse;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.entity.Wallet;
import com.markethub.repository.WalletRepository;
import com.markethub.security.CurrentUserService;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final CurrentUserService currentUserService;

    public WalletService(
            WalletRepository walletRepository,
            CurrentUserService currentUserService
    ) {
        this.walletRepository = walletRepository;
        this.currentUserService = currentUserService;
    }

    public WalletResponse getMyWallet() {
        User customer = getCurrentCustomer();

        Wallet wallet = walletRepository.findByUser(customer)
                .orElseThrow(() -> new RuntimeException("Customer wallet not found"));

        return mapToResponse(wallet);
    }

    public WalletResponse addFunds(AddWalletFundsRequest request) {
        User customer = getCurrentCustomer();

        Wallet wallet = walletRepository.findByUser(customer)
                .orElseThrow(() -> new RuntimeException("Customer wallet not found"));

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));

        Wallet savedWallet = walletRepository.save(wallet);

        return mapToResponse(savedWallet);
    }

    private User getCurrentCustomer() {
        User customer = currentUserService.getCurrentUser();

        if (customer.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("Only customers can access wallets");
        }

        if (!customer.isActive()) {
            throw new RuntimeException("Customer account is not active");
        }

        return customer;
    }

    private WalletResponse mapToResponse(Wallet wallet) {
        return WalletResponse.builder()
                .walletId(wallet.getId())
                .customerId(wallet.getUser().getId())
                .customerUsername(wallet.getUser().getUsername())
                .balance(wallet.getBalance())
                .build();
    }
}