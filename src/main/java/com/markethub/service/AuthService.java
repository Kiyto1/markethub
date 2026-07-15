package com.markethub.service;

import java.math.BigDecimal;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.markethub.dto.LoginRequest;
import com.markethub.dto.LoginResponse;
import com.markethub.dto.RegisterRequest;
import com.markethub.dto.UserResponse;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.entity.Wallet;
import com.markethub.repository.UserRepository;
import com.markethub.repository.WalletRepository;
import com.markethub.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        WalletRepository walletRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
) {
    this.userRepository = userRepository;
    this.walletRepository = walletRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin users cannot register publicly");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.CUSTOMER) {
            Wallet wallet = Wallet.builder()
                    .user(savedUser)
                    .balance(BigDecimal.ZERO)
                    .build();

            walletRepository.save(wallet);
        }

        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .active(savedUser.isActive())
                .build();
    }

public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsernameOrEmail())
            .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
            .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

    if (!user.isActive()) {
        throw new RuntimeException("Account is not active");
    }

    boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(),
            user.getPasswordHash()
    );

    if (!passwordMatches) {
        throw new RuntimeException("Invalid username/email or password");
    }

    String token = jwtService.generateToken(user);

    return LoginResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .active(user.isActive())
            .message("Login successful")
            .build();
}
}