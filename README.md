# PROCURA – Smart Procurement & Purchase Order Management System

<p align="center">
  <b>A Full-Stack Smart Procurement and Purchase Order Management System</b>
</p>

<p align="center">
  Built with Spring Boot, Spring Security, React, MySQL and REST APIs
</p>

---

## 📌 Project Overview

**PROCURA** is a full-stack web-based procurement management system designed to digitize and simplify the complete procurement process within an organization or educational institution.

The system provides a centralized platform where:

* **Users/Students** can browse products and raise purchase requests.
* **Managers/HODs** can review, approve or reject requests and process payments.
* **Suppliers** can manage products, receive approved orders and update delivery tracking.

The application replaces manual procurement activities with a centralized digital workflow that improves transparency, request tracking, payment management and supplier coordination.

---

# 🎯 Problem Statement

Traditional procurement processes often involve:

* Manual request submission
* Paper-based approvals
* Difficulty tracking request status
* Separate communication between users, managers and suppliers
* Manual payment tracking
* Difficulty maintaining procurement records
* Lack of centralized reporting

PROCURA addresses these problems by providing a **role-based, centralized procurement management platform**.

---

# 💡 Proposed Solution

PROCURA provides a complete digital procurement workflow:

```text
User/Student
     │
     │ Browse Products
     ▼
Raise Purchase Request
     │
     ▼
Manager/HOD Review
     │
     ├───────────────┐
     │               │
  APPROVE         REJECT
     │               │
     ▼               ▼
Manager Payment    Completed
     │
     ▼
Supplier Notification
     │
     ▼
Supplier Accepts Order
     │
     ▼
Order Tracking
     │
     ▼
Delivered
```

---

# 👥 User Roles

The application contains three primary roles.

## 1. 👨‍🎓 User / Student

Users can:

* Register an account
* Login securely
* Browse available products
* View product details
* Raise purchase requests
* Specify required quantity
* View submitted requests
* Track request status
* Download product/request CSV information

---

## 2. 👨‍💼 Manager / HOD

Managers can:

* Register and login
* View requests belonging to their department
* Review purchase requests
* Approve requests
* Reject requests
* View requested product information
* Make payments for approved requests
* Verify payment using manager PIN
* View payment status
* Provide product feedback/rating
* Download manager CSV reports
* Download payment CSV reports

---

## 3. 🏭 Supplier

Suppliers can:

* Register and login
* Add products
* View their products
* Manage product information
* View paid orders
* Accept orders
* Reject orders
* Update order tracking status
* Track delivery progress
* View payment history
* Download payment history CSV

---

# 🛠️ Technologies Used

## Backend

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| Java                    | Backend programming language     |
| Spring Boot             | Backend framework                |
| Spring Security         | Authentication and authorization |
| Spring Data JPA         | Database operations              |
| Hibernate               | ORM                              |
| MySQL                   | Relational database              |
| REST API                | Frontend-backend communication   |
| BCrypt                  | Password encryption              |
| SMTP                    | Email notifications              |
| OpenCSV / CSV utilities | CSV report generation            |
| Maven                   | Dependency management            |
| Apache Tomcat           | Application server               |

---

## Frontend

| Technology   | Purpose                                 |
| ------------ | --------------------------------------- |
| React        | Frontend framework                      |
| JavaScript   | Application logic                       |
| Vite         | Frontend development/build tool         |
| Axios        | API communication                       |
| React Router | Page navigation                         |
| Lucide React | Icons                                   |
| CSS          | Styling and responsive UI               |
| LocalStorage | Session-related client-side information |

---

# 🏗️ System Architecture

```text
                   ┌─────────────────────┐
                   │       React         │
                   │      Frontend       │
                   │      Vite + JS      │
                   └──────────┬──────────┘
                              │
                              │ Axios / REST API
                              ▼
                   ┌─────────────────────┐
                   │     Spring Boot     │
                   │       Backend       │
                   ├─────────────────────┤
                   │ Controllers         │
                   │ Services            │
                   │ Repositories        │
                   │ DTOs                │
                   │ Security            │
                   └──────────┬──────────┘
                              │
                              │ JPA / Hibernate
                              ▼
                   ┌─────────────────────┐
                   │       MySQL         │
                   │      Database       │
                   └─────────────────────┘
```

---

# 📁 Project Structure

The project is divided into two major parts:

```text
PROCURA/
│
├── backend/
│
└── frontend/
```

---

# 🔵 Backend – Spring Boot

The backend is developed using **Java and Spring Boot**.

## Backend Structure

```text
backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── InfosysSpringProject/
│       │
│       │               ├── Controller/
│       │               ├── Service/
│       │               ├── Repository/
│       │               ├── Entity/
│       │               ├── Dto/
│       │               ├── Security/
│       │               └── InfosysSpringProjectApplication.java
│       │
│       └── resources/
│           ├── application.properties
│           └── ...
│
├── pom.xml
└── README.md
```

---

# 🔹 Backend Layers

PROCURA follows a layered backend architecture.

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

## 1. Controller Layer

The Controller layer handles HTTP requests from the React frontend.

Examples:

```text
/user/register
/user/login

/manager/register
/manager/login

/supplier/register
/supplier/login

/product

/raiserequest

/payment

/product-rating

/csv
```

Controllers receive requests, validate input and call the appropriate service methods.

---

## 2. Service Layer

The Service layer contains the main business logic.

Examples of business operations:

* User registration
* Manager registration
* Supplier registration
* Product creation
* Purchase request creation
* Request approval/rejection
* Payment processing
* Supplier tracking
* Feedback management
* CSV generation
* Email notifications

---

## 3. Repository Layer

The Repository layer communicates with the MySQL database using Spring Data JPA.

Repositories are responsible for:

* Saving data
* Updating data
* Finding records
* Deleting records
* Custom database queries

---

## 4. Entity Layer

Entities represent database tables.

Major entities include:

```text
User
Manager
Supplier
Product
RaiseRequest
Payment
ProductRating
```

Relationships between entities are managed using JPA/Hibernate.

---

# 🔐 Authentication & Authorization

PROCURA uses **Spring Security** for authentication and role-based author
