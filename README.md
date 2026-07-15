# Markethub

Markethub is a full-stack marketplace backend built with Spring Boot and PostgreSQL.  
It supports sellers, customers, products, carts, wallet payments, checkout, orders, admin controls, and JWT authentication.

## Tech Stack

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- PostgreSQL
- Supabase Database
- Maven
- Lombok
- Bean Validation

## Main Features

### Authentication
- User registration
- BCrypt password hashing
- Login with JWT token
- Role-based access: CUSTOMER, SELLER, ADMIN
- Protected API endpoints

### Seller Features
- Create products
- Update own products
- Delete own products
- View own products
- View sold order items

### Customer Features
- Browse products
- Add products to cart
- Update cart item quantity
- Remove cart items
- Clear cart
- View wallet
- Add wallet funds for demo/testing
- Checkout using wallet balance
- View order history

### Admin Features
- View all users
- Filter users by role
- Activate/deactivate users
- View all products
- Delete products

### Checkout Flow
The checkout process performs the following steps:

1. Reads the logged-in customer from JWT
2. Gets the customer cart
3. Validates product stock
4. Calculates total amount
5. Checks wallet balance
6. Creates an order
7. Creates order items
8. Reduces product stock
9. Deducts wallet balance
10. Creates payment record
11. Clears the cart

The checkout service uses `@Transactional` to make sure the full process succeeds or rolls back together.

## Project Structure

```text
src/main/java/com/markethub
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── security
└── service