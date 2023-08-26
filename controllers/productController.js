const connection = require('../database');
const path = require('path');

module.exports.createProductController = (req, res) => {
    try {
        const { name, slug, description, price, category, id } = req.body
        const fileName = req.file.filename;
        const fileUrl = path.join(fileName);
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'name is required' });
            case !slug:
                return res.status(500).send({ error: 'slug is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
        }

        const sql = 'insert into product (name,slug,description,price,category,photo,s_id,status) values(?,?,?,?,?,?,?,?)';
        connection.query(sql, [
            name,
            slug,
            description,
            price,
            category,
            fileUrl,
            id,
            'Pending'
        ], (err, data) => {
            if (err) {
                return res.status(501).send({
                    success: false,
                    err,
                    message: 'Error in creating product'
                });
            }
            else {
                return res.status(201).send({
                    success: true,
                    data,
                    message: 'Created product successfully'
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating product'
        });
    }
}

module.exports.getProductController = (req, res) => {
    try {

        //change made to get approved product
        const sql = 'select * from product where status = ?';
        //change made to get approved product
        connection.query(sql, [req.params.status], (err, products) => {
            if (err) {
                return res.status(501).send({
                    success: false,
                    message: 'Product fetch failed',
                    err
                });
            }
            else {
                return res.status(200).send({
                    success: true,
                    message: 'All products found successfully',
                    products
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in getting products',
            error: error.message
        });
    }
}

module.exports.getFilteredProductController = (req, res) => {

    try {
        const category = req.query.category;
        const price = req.query.price;
        // console.log(category,price);
        var sql = 'select * from product';
        var categoryArray = [];
        if (category && category.length)
            categoryArray = category.split(',');
        var priceArray = [];
        if (price && price.length)
            priceArray = price.split(',');
        if (categoryArray.length || priceArray.length)
            sql = sql.concat(' where');
        categoryArray.map((cat, index) => {
            if (index === 0)
                sql = sql.concat(' (');
            else
                sql = sql.concat(' or ');
            sql = sql.concat('category=?');
        });
        if (categoryArray.length)
            sql = sql.concat(')');
        if (priceArray.length) {
            sql = sql.concat(' ');
            if (categoryArray.length)
                sql = sql.concat('and ');
            sql = sql.concat('(price>=? and price<=?)');
        }

        console.log(sql);
        var values = [];
        categoryArray.map((cat, index) => {
            values.push(cat);
        });
        if (priceArray.length) {
            var mn = 1000000, mx = 0;
            priceArray.map((str, index) => {
                var arr = str.split('-');
                mn = Math.min(mn, arr[0]);
                if (arr[1] != 'above')
                    mx = Math.max(mx, arr[1]);
                else
                    mx = 1000000;
            });
            console.log(mn, mx);
            values.push(mn);
            values.push(mx);
        }
        //change made to get Approved product
        //sql = sql.concat('and status = Approved');

        connection.query(sql, values, (err, products) => {
            if (err) {
                res.status(501).send({
                    success: false,
                    message: 'Product fetch failed',
                    err
                });
            }
            else {
                res.status(200).send({
                    success: true,
                    message: 'All products found successfully',
                    products
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting products',
            error: error.message
        });
    }
}

module.exports.getSingleProductController = (req, res) => {
    try {
        const sql = 'select * from product where slug=?';
        connection.query(sql, [req.params.slug], (err, product) => {
            if (err) {
                return res.status(501).send({
                    success: false,
                    message: 'Error in getting single product',
                    err
                });
            }
            else {
                return res.status(200).send({
                    success: true,
                    message: 'Single product fetched',
                    product
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in getting single product',
            error
        });
    }
}