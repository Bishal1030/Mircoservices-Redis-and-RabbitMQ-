const express = require('express');
const app = express();
const mongoose = require('mongoose')
const amqp = require('amqplib');
const Order = require('./models/order')


require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({extended:true}))


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("order service db connected")
}).catch((e)=> {
    console.log(e);
})

let connection, channel;
async function connectToRabbitMQ(){
    const amqpServer = "amqp://localhost"
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel();
    await channel.assertQueue('order-service-queue')
}

connectToRabbitMQ().then(() => {
    channel.consume('order-service-queue', async (data) => {
        const {products} = JSON.parse(data.content);
        console.log(products); // Consoling all the products
        const newOrder = await createOrder(products); // Await createOrder
        channel.ack(data);
        channel.sendToQueue('product-service-queue', Buffer.from(JSON.stringify(newOrder)));
    });
})

createOrder = async(products) => {
    let total = 0;
    products.forEach((ele) => {
        total+= ele.price;
    })

    const order = await new Order({
        products,
        total
    })

    await order.save();
    return order;
}

const port = process.env.PORT || 3003;



app.listen(port, () => {
    console.log(`Order service running on port ${port}`)
})