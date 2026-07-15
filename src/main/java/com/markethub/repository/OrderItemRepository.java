package com.markethub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.Order;
import com.markethub.entity.OrderItem;
import com.markethub.entity.User;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);

    List<OrderItem> findBySeller(User seller);
}