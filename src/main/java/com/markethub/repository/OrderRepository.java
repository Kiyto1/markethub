package com.markethub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.Order;
import com.markethub.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomer(User customer);
}