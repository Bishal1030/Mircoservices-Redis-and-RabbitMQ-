# 🚀 Microservices Product & Order System

A robust microservices architecture demonstrating efficient service communication using Redis caching and RabbitMQ messaging.

## 📋 Overview

This project showcases a simple but powerful microservices implementation with two core services:

### Product Service
- Manages product data storage and retrieval
- Stores complete product information in MongoDB
- Caches essential product details in Redis for fast access
- Exposes API endpoints for product management

### Order Service
- Processes customer orders efficiently
- Retrieves product information from Redis cache when available
- Falls back to MongoDB when cache misses occur
- Communicates asynchronously via RabbitMQ for order processing


- **Redis** caches product details to reduce database load and improve response times
- **RabbitMQ** enables asynchronous communication between services
- **MongoDB** provides persistent storage for product and order data

## 🔧 Prerequisites

- **Node.js** and **npm**
- **MongoDB** running locally or accessible remotely
- **Redis** server running locally or accessible remotely
- **RabbitMQ** server running locally or accessible remotely

## 🚀 Setup & Installation

### 1. Clone the repository

```sh
git clone <repository-url>
cd microservices-project
```

### 2. Install dependencies for each service

For Product Service:
```sh
cd product-service
npm install
```

For Order Service:
```sh
cd order-service
npm install
```

### 3. Configure Environment Variables

Create `.env` files in each service directory with the following configurations:

**product-service/.env**:
```
MONGO_URI=mongodb://localhost:27017/your-database
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
PORT=3001
```

**order-service/.env**:
```
MONGO_URI=mongodb://localhost:27017/your-database
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
PORT=3002
```

## 📡 API Endpoints

### Product Service (Port 3001)

- **POST /** - Create a new product
  - Request Body:
    ```json
    {
      "name": "Product Name",
      "price": 29.99,
      "quantity": 100
    }
    ```
  - Response:
    ```json
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 100
    }
    ```

### Order Service (Port 3002)

- **POST /buy** - Process an order
  - Request Body:
    ```json
    {
      "productIds": ["product_id_1", "product_id_2"]
    }
    ```
  - Response:
    ```json
    {
      "orderId": "order_id",
      "status": "processing",
      "products": [
        {
          "id": "product_id_1",
          "name": "Product Name",
          "price": 29.99
        },
        {
          "id": "product_id_2",
          "name": "Another Product",
          "price": 19.99
        }
      ],
      "total": 49.98
    }
    ```

## 🏃‍♂️ Running the Services

Start each service in a separate terminal window:

Product Service:
```sh
cd product-service
npm start
```

Order Service:
```sh
cd order-service
npm start
```

## 🔄 Workflow Example

### 1. Create a Product

```sh
curl -X POST http://localhost:3001/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Awesome Product","price":49.99,"quantity":100}'
```

The Product Service stores the product in MongoDB and caches essential details in Redis.

### 2. Place an Order

```sh
curl -X POST http://localhost:3002/buy \
  -H "Content-Type: application/json" \
  -d '{"productIds":["product_id_1","product_id_2"]}'
```

The Order Service:
1. Retrieves product details from Redis (if available)
2. Falls back to MongoDB for cache misses
3. Updates Redis cache with any retrieved products
4. Processes the order and sends it to RabbitMQ


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📬 Contact

If you have any questions or feedback, please open an issue in the repository.

---

Built with ❤️ using Node.js, Express, MongoDB, Redis, and RabbitMQ.
