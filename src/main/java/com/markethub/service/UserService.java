package com.markethub.service;

import org.springframework.stereotype.Service;

import com.markethub.dto.UserResponse;
import com.markethub.entity.User;
import com.markethub.security.CurrentUserService;

@Service
public class UserService {

    private final CurrentUserService currentUserService;

    public UserService(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    public UserResponse getMe() {
        User user = currentUserService.getCurrentUser();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
}