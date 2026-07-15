package com.markethub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.User;
import com.markethub.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUser(User user);
}