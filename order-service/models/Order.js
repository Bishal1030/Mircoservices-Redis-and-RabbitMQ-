const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    products:[
        {product_id: String}
    ],
    total: {
        type:Number,
        required: true
    }
}, {timestamps:true})

const Order = mongoose.model("order", OrderSchema)

module.exports = Order;