package com.markethub.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.markethub.dto.OrderItemResponse;
import com.markethub.dto.OrderResponse;
import com.markethub.entity.CartItem;
import com.markethub.entity.Order;
import com.markethub.entity.OrderItem;
import com.markethub.entity.OrderStatus;
import com.markethub.entity.Payment;
import com.markethub.entity.PaymentStatus;
import com.markethub.entity.Product;
import com.markethub.entity.Role;
import com.markethub.entity.User;
import com.markethub.entity.Wallet;
import com.markethub.repository.CartItemRepository;
import com.markethub.repository.OrderItemRepository;
import com.markethub.repository.OrderRepository;
import com.markethub.repository.PaymentRepository;
import com.markethub.repository.ProductRepository;
import com.markethub.repository.WalletRepository;
import com.markethub.security.CurrentUserService;

@Service
public class CheckoutService {

    private final WalletRepository walletRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;

    public CheckoutService(
            WalletRepository walletRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PaymentRepository paymentRepository,
            CurrentUserService currentUserService
    ) {
        this.walletRepository = walletRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public OrderResponse checkout() {
        User customer = getCurrentCustomer();

        Wallet wallet = walletRepository.findByUser(customer)
                .orElseThrow(() -> new RuntimeException("Customer wallet not found"));

        List<CartItem> cartItems = cartItemRepository.findByCustomer(customer);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            if (item.getQuantity() > product.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal unitPrice = BigDecimal.valueOf(product.getPrice());
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            totalAmount = totalAmount.add(subtotal);
        }

        if (wallet.getBalance().compareTo(totalAmount) < 0) {
            throw new RuntimeException("Insufficient wallet balance");
        }

        Order order = Order.builder()
                .customer(customer)
                .totalAmount(totalAmount)
                .status(OrderStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            BigDecimal unitPrice = BigDecimal.valueOf(product.getPrice());
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .seller(product.getSeller())
                    .productNameSnapshot(product.getName())
                    .unitPriceSnapshot(unitPrice)
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();

            orderItemRepository.save(orderItem);

            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        wallet.setBalance(wallet.getBalance().subtract(totalAmount));
        walletRepository.save(wallet);

        Payment payment = Payment.builder()
                .order(savedOrder)
                .customer(customer)
                .amount(totalAmount)
                .method("WALLET")
                .status(PaymentStatus.SUCCESS)
                .paidAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        cartItemRepository.deleteAll(cartItems);

        List<OrderItem> savedItems = orderItemRepository.findByOrder(savedOrder);

        return mapToResponse(savedOrder, savedItems);
    }

    public List<OrderResponse> getMyOrders() {
        User customer = getCurrentCustomer();

        return orderRepository.findByCustomer(customer)
                .stream()
                .map(order -> mapToResponse(order, orderItemRepository.findByOrder(order)))
                .toList();
    }

    private User getCurrentCustomer() {
        User customer = currentUserService.getCurrentUser();

        if (customer.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("Only customers can checkout");
        }

        if (!customer.isActive()) {
            throw new RuntimeException("Customer account is not active");
        }

        return customer;
    }

    private OrderResponse mapToResponse(Order order, List<OrderItem> items) {
        List<OrderItemResponse> itemResponses = items.stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductNameSnapshot())
                        .sellerUsername(item.getSeller().getUsername())
                        .unitPrice(item.getUnitPriceSnapshot())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerUsername(order.getCustomer().getUsername())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}