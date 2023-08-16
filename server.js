const app = require("./app");
const express = require('express');
const connection = require("./database");
const categoryRoutes = require('./routes/categoryRoutes');
const morgan = require('morgan');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

//config
if(process.env.NODE_ENV != 'PRODUCTION'){
    require("dotenv").config({
        path:"config/.env"
    })
}

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/',express.static('uploads'));

//connect db
connection.connect();

//routes
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/review',reviewRoutes);

app.get('/',(req,res)=>{
    connection.query('select * from user',(err,rows,fields)=>{
        if(err) return res.json("Error");
        return res.json(rows);
    })
})

//create server
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on https://localhost:${process.env.PORT}`);
})