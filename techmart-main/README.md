# 🛒 TechMart – Full Stack E-Commerce Platform

TechMart is a full-stack e-commerce application built using **Spring Boot, MySQL, and HTML/CSS/JS**.

---

##  Features

###  Admin

* View users & vendors
* Delete users/vendors
* View all orders
* System stats

### Vendor

* Add / update / delete products
* Manage orders
* View item requests

###  User

* Signup & login
* Browse products
* Add to cart
* Place orders
* Track orders

---

##  How to Run

###  1. Create Database

```sql
CREATE DATABASE techmart_db;
```

---

###  2. Configure Backend

Go to:

```text
backend/src/main/resources/application.properties
```

Update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/techmart_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

---

###  3. Run Backend

```bash
cd backend
mvn spring-boot:run
```

---

### 4. Open Application in Browser

After running the backend, open your browser and go to:

```
http://localhost:8080
```

This will load the UI (frontend pages served by Spring Boot).

---


---

##  Admin Setup

Run in MySQL:

```sql
INSERT INTO users (name, email, password, role)
VALUES (
'Admin',
'admin@techmart.com',
'$2a$10$7QfkX/lCk6XnqV2U1z3HXuBcLgTsOg3Y/KaQ5w6z9v4MwFjZ.xP8S',
'ADMIN'
);
```

---

### Admin Login

* Email: [admin@techmart.com](mailto:admin@techmart.com)
* Password: admin123

---

##  API Example

* GET /api/products
* POST /api/auth/user/signup
* POST /api/orders/checkout

---

##  Tech Stack

* Java 17
* Spring Boot
* MySQL
* Maven
* HTML/CSS/JS

---

## NOTE
Frontend is static → open pages manually or use Live Server.

---

Built as a full-stack learning project.
