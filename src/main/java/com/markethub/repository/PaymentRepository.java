package com.markethub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.markethub.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}