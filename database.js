const mysql = require('mysql')

//config
if(process.env.NODE_ENV != 'PRODUCTION'){
    require("dotenv").config({
        path:"config/.env"
    })
}

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

module.exports = connection;