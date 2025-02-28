const express = require('express');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose')

const productRoute = require('./routes/routes')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/products', productRoute)

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("product service db connected")
}).catch((e)=> {
    console.log(e);
})
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Product service running on port ${port}`)
})