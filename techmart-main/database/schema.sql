-- ============================================================
-- TechMart System - MySQL Schema
-- Run this file in MySQL before starting the Spring Boot app
-- ============================================================

CREATE DATABASE IF NOT EXISTS techmart_db;
USE techmart_db;

-- ─────────────────────────────────────────────
-- TABLE: users (role = USER or ADMIN)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    role       ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- TABLE: vendors
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(150)        NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password      VARCHAR(255)        NOT NULL,
    phone         VARCHAR(20),
    created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- TABLE: products  (added by vendors)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id   BIGINT         NOT NULL,
    name        VARCHAR(200)   NOT NULL,
    description TEXT,
    price       DECIMAL(10,2)  NOT NULL,
    stock       INT            NOT NULL DEFAULT 0,
    category    VARCHAR(100),
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- ─────────────────────────────────────────────
-- TABLE: cart_items
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT  NOT NULL,
    product_id BIGINT  NOT NULL,
    quantity   INT     NOT NULL DEFAULT 1,
    CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users(id),
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ─────────────────────────────────────────────
-- TABLE: orders
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT        NOT NULL,
    total_amount   DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH','UPI') NOT NULL DEFAULT 'CASH',
    status         ENUM('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED')
                   NOT NULL DEFAULT 'PENDING',
    address        VARCHAR(500),
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ─────────────────────────────────────────────
-- TABLE: order_items  (line items per order)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT        NOT NULL,
    product_id BIGINT        NOT NULL,
    quantity   INT           NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id),
    CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ─────────────────────────────────────────────
-- TABLE: item_requests  (user requests new items)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS item_requests (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    item_name    VARCHAR(200) NOT NULL,
    description  TEXT,
    status       ENUM('OPEN','SEEN','FULFILLED') NOT NULL DEFAULT 'OPEN',
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_req_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ─────────────────────────────────────────────
-- Seed: default admin account  (password: admin123)
-- BCrypt hash of "admin123"
-- ─────────────────────────────────────────────
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'admin@techmart.com',
        '$2a$10$7QfkX/lCk6XnqV2U1z3HXuBcLgTsOg3Y/KaQ5w6z9v4MwFjZ.xP8S',
        'ADMIN');
