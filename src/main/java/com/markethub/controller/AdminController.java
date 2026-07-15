package com.markethub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.markethub.dto.ProductResponse;
import com.markethub.dto.UserResponse;
import com.markethub.entity.Role;
import com.markethub.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/users/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable Role role) {
        return adminService.getUsersByRole(role);
    }

    @PutMapping("/users/{userId}/activate")
    public UserResponse activateUser(@PathVariable Long userId) {
        return adminService.activateUser(userId);
    }

    @PutMapping("/users/{userId}/deactivate")
    public UserResponse deactivateUser(@PathVariable Long userId) {
        return adminService.deactivateUser(userId);
    }

    @GetMapping("/products")
    public List<ProductResponse> getAllProducts() {
        return adminService.getAllProducts();
    }

    @DeleteMapping("/products/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        adminService.deleteProduct(productId);
    }
}