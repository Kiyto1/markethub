package com.markethub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.CartItem;
import com.markethub.entity.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCustomer(User customer);

    Optional<CartItem> findByCustomerIdAndProductId(Long customerId, Long productId);
}