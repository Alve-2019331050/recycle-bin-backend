const app = require("./app");
const express = require('express');
const connection = require("./database");
const categoryRoutes = require('./routes/categoryRoutes');
const morgan = require('morgan');

//config
if(process.env.NODE_ENV != 'PRODUCTION'){
    require("dotenv").config({
        path:"config/.env"
    })
}

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//connect db
connection.connect();

//routes
app.use('/api/v1/category',categoryRoutes);

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