const connection = require('../database');
const path = require('path');

module.exports.createProductController = (req,res) => {
    try {
        const {name,slug,description,price,category} = req.body
        const fileName = req.file.filename;
        const fileUrl = path.join(fileName);
        switch(true){
            case !name:
                return res.status(500).send({error:'name is required'});
            case !slug:
                return res.status(500).send({error:'slug is required'});
            case !description:
                return res.status(500).send({error:'description is required'});
            case !price:
                return res.status(500).send({error:'price is required'});
            case !category:
                return res.status(500).send({error:'category is required'});
        }

        const sql = 'insert into product (name,slug,description,price,category,photo) values(?,?,?,?,?,?)';
        connection.query(sql,[
            name,
            slug,
            description,
            price,
            category,
            fileUrl
        ],(err,data) => {
            if(err){
                return res.status(501).send({
                    success:false,
                    err,
                    message:'Error in creating product'
                });
            }
            else{
                return res.status(201).send({
                    success:true,
                    data,
                    message:'Created product successfully'
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating product'
        });
    }
}

module.exports.getProductController = (req,res)=>{
    try {
        const sql = 'select * from product';
        connection.query(sql,(err,products)=>{
            if(err){
                res.status(501).send({
                    success:false,
                    message:'Product fetch failed',
                    err
                });
            }
            else{
                res.status(200).send({
                    success:true,
                    message:'All products found successfully',
                    products
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in getting products',
            error: error.message
        });
    }
}

module.exports.getSingleProductController = (req,res)=>{
    try {
        const sql = 'select * from product where slug=?';
        connection.query(sql,[req.params.slug],(err,product)=>{
            if(err){
                res.status(501).send({
                    success:false,
                    message:'Error in getting single product',
                    err
                });
            }
            else{
                res.status(200).send({
                    success:true,
                    message:'Single product fetched',
                    product
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in getting single product',
            error
        });
    }
}