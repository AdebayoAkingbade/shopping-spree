const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require('./routes/users');
const authRouter = require("./routes/auth");
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("DB is connected successfully"))
.catch((err)=> {
    console.log(err)
});

app.use(express.json());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

app.listen(process.env.PORT || 7000, ()=>{
    console.log("my server is running");
})