const app = require("./app");
const connection = require("./database");

//config
if(process.env.NODE_ENV != 'PRODUCTION'){
    require("dotenv").config({
        path:"config/.env"
    })
}

//connect db
connection.connect();

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