package com.markethub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySellerId(Long sellerId);
}