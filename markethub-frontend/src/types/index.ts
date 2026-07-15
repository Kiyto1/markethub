export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
  message: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sellerId: number;
  sellerUsername: string;
  imageUrl?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Wallet {
  walletId: number;
  customerId: number;
  customerUsername: string;
  balance: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  sellerUsername: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerUsername: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface SellerOrderItem {
  orderId: number;
  customerId: number;
  customerUsername: string;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
}
