const express = require("express");
const router = express.Router();
const { createClient } = require("redis");
const Product = require("../models/Product");
const amqp = require("amqplib");

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

let connection, channel, order;
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-service-queue");
}

connectToRabbitMQ();

router.post("/", async (req, res) => {
  const { name, price, quantity } = req.body;
  if (!name || !price || !quantity) {
    return res.status(400).json({
      message: "Plese provide product details",
    });
  }

  const product = await new Product({ name, price, quantity });
  await product.save();

  console.log("Product added:", product); // Log the product object


  // Cache the product in Redis
  client.setEx(`product:${product._id}`, 3600, JSON.stringify(product));
  return res.status(201).json({
    message: "Product created successfully",
  });
});

router.post("/buy", async (req, res) => {
    const { productIds } = req.body;
    const products = [];
  
    for (let productId of productIds) {
      const cachedData = await client.get(`product:${productId}`);
      if (cachedData) {
        products.push(JSON.parse(cachedData));
      } else {
        // Use lean() to get a plain JavaScript object (no circular refs)
        const product = await Product.findById(productId).lean();
        if (product) {
          products.push(product);
          client.setEx(`product:${product._id}`, 3600, JSON.stringify(product));
        }
      }
    }
  
    channel.sendToQueue(
      "order-service-queue",
      Buffer.from(JSON.stringify({ products }))
    );
  
    channel.consume("product-service-queue", (data) => {
      console.log("Consuming from product service queue!");
      order = JSON.parse(data.content);
      console.log(order);
      channel.ack(data);
    });
  
    return res.status(201).json({ message: "Order created successfully", products });
  });
  

module.exports = router;
