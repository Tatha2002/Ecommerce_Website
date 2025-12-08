# Ecommerce_Website

This project is a basic e-commerce system built using NestJS microservices.
It consists of two separate services that communicate using RabbitMQ and use PostgreSQL as their database.

## Overview

The system contains:

1️⃣ Product & Order Service

Manages Products (CRUD)
Manages Orders
Publishes RabbitMQ events (order_created, etc.)

2️⃣ Customer Service

Manages Customers (CRUD)
Listens to RabbitMQ events and updates its own database for synchronization
Each microservice has its own database, ensuring loose coupling and real microservice architecture.

## Tech Stack

NestJS (Microservices)
PostgreSQL (TypeORM)
RabbitMQ (Message Broker)
Next.js (Simple frontend to list products & place orders)

⚙️ How It Works (Short Summary)

Product service exposes APIs for products & orders
Customer service exposes APIs for customers
When an order is placed:
Product service saves the order
Sends RabbitMQ event
Customer service receives the event and updates its DB
Both services stay consistent using event-driven communication

## Main Features

CRUD for Products
CRUD for Customers
Order creation
RabbitMQ-based sync between services
Separate PostgreSQL DB for each microservice
Clean modular NestJS structure

## Install Dependencies:

Inside each microservice:

npm install

Setup RabbitMQ:
docker-compose up -d

Run Microservices:
npm run start:dev

## API Endpoints (Short)

Product Service

GET /products
POST /products
PUT /products/:id
DELETE /products/:id
POST /orders

Customer Service

GET /customers
POST /customers
PUT /customers/:id

📨 RabbitMQ Events

order_created
product_created
product_updated

📄 Submission Contents

Both NestJS microservices
Full CRUD implementation
RabbitMQ publisher/subscriber
Next.js frontend (basic UI)
PostgreSQL setup
README 
