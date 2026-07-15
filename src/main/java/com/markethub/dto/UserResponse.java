package com.markethub.dto;

import com.markethub.entity.Role;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean active;
}