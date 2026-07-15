package com.markethub.dto;

import com.markethub.entity.Role;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private String tokenType;

    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean active;

    private String message;
}