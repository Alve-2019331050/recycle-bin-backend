const connection = require('../database');

module.exports.addController = (req, res) => {
    const u_id = req.body.u_id;
    const p_id = req.body.p_id;
    const quantity = req.body.quantity;
    // console.log(u_id,p_id,quantity);
    try {
        const sql = 'select quantity from cart where b_id=? and p_id=?';
        connection.query(sql, [u_id, p_id], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(501).send({
                    success: false,
                    message: err
                });
            }
            if (data.length) {
                const newSql = 'update cart set quantity=? where b_id=? and p_id=?';
                connection.query(newSql, [data[0].quantity + quantity, u_id, p_id], (newErr, newData) => {
                    if (newErr) {
                        console.log(newErr);
                        return res.status(501).send({
                            success: false,
                            message: newErr.message
                        });
                    }
                    else {
                        return res.status(200).send({
                            success: true,
                            message: 'Item added to cart',
                            data: newData
                        });
                    }
                });
            }
            else {
                const newSql = 'insert into cart (b_id,p_id,quantity) values(?,?,?)';
                connection.query(newSql, [u_id, p_id, quantity], (newErr, newData) => {
                    if (newErr) {
                        console.log(err);
                        return res.status(501).send({
                            success: false,
                            message: err.message
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: 'Item added to cart',
                        data: newData
                    });
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

module.exports.getItems = (req, res) => {
    try {
        const b_id = req.query.b_id;
        console.log(b_id);
        const sql = 'select p_id,quantity from cart where b_id=?';
        connection.query(sql, b_id, (err, data) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: err
                });
            }
            else if (!data.length) {
                return res.status(200).send({
                    success: true,
                    message: 'Fetched cart items successfully',
                    product: [],
                    quantity: []
                });
            }
            else {
                var newSql = '';
                if (data.length)
                    newSql = newSql.concat('select * from product where');
                data.map(({ p_id, quantity }, index) => {
                    if (index > 0)
                        newSql = newSql.concat(' or');
                    newSql = newSql.concat(' p_id=?');
                });
                var values = [], resQuantity = [];
                data.map(({ p_id, quantity }) => {
                    values.push(p_id);
                    resQuantity.push(quantity);
                })
                console.log(data);
                connection.query(newSql, values, (newErr, newData) => {
                    if (newErr) {
                        return res.status(501).send({
                            success: false,
                            message: newErr
                        });
                    }
                    else {
                        return res.status(200).send({
                            success: true,
                            message: 'Fetched cart items successfully',
                            product: newData,
                            quantity: resQuantity
                        });
                    }
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(501).send({
            success: false,
            message: 'Failed to get cart items'
        });
    }
};

module.exports.deleteItem = (req, res) => {
    try {
        const sql = 'delete from cart where b_id=? and p_id=?';
        connection.query(sql, [req.query.b_id, req.query.p_id], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(501).send({
                    success: false,
                    message: 'Could not delete item'
                });
            }
            else {
                return res.status(200).send({
                    success: true,
                    message: 'Item deleted successfully'
                })
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not delete item'
        });
    }
};

module.exports.placeOrderController = (req,res) => {
    try {
        const {cartItems} = req.body;
        const {u_id} = req.body;
        // console.log(cartItems,u_id);
        const sql = 'insert into orders(u_id) values(?)';
        connection.query(sql,[u_id],(err,data)=>{
            if(err){
                return res.status(200).send({
                    success:false,
                    message:'Error in placing order'
                });
            }
            else{
                var newSql = 'SELECT * FROM orders ORDER BY order_id DESC LIMIT 1;'
                connection.query(newSql,[u_id],(nerr,ndata)=>{
                    if(nerr){
                        return res.status(200).send({
                            success:false,
                            message:'Error in placing order'
                        });
                    }
                    else{
                        const order_id = ndata[0].order_id;
                        // console.log(order_id);
                        newSql = 'insert into issues(order_id,p_id) values(?,?)';
                        cartItems.map((item,index)=>{
                            // console.log(item);
                            return connection.query(newSql,[order_id,item.product.p_id],(nErr,nData)=>{
                                console.log(nData);
                                if(nErr){
                                    return res.status(200).send({
                                        success:false,
                                        message:'Error in placing order'
                                    });
                                }
                            });
                        });
                        return res.status(200).send({
                            success:true
                        })
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:'Error in placing order'
        });
    }  
};

module.exports.delete = (req,res)=>{
    try {
        const sql  = 'delete from cart where b_id=?';
        connection.query(sql,[req.params.u_id],(err,data)=>{
            if(err){
                return res.status(200).send({
                    success:false
                });
            }
            else{
                return res.status(200).send({
                    success:true
                });
            }
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:'Error in deleting'
        });
    }
}

module.exports.getUserOrderController = (req, res) => {
    try {
        const sql = 'select o.order_id as orderId,p.p from orders o join issues i on o.order_id = i.order_id where o.u_id=?';
        connection.query(sql,[req.params.user_id],(err,data)=>{
            if(err){
                return res.status(200).send({
                    success:false,
                    message:'Error in fetching'
                });
            }
            else{
                return res.status(200).send({
                    success:true
                });
            }
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:'Error in fetching'
        });
    }
}

module.exports.getAdminOrderController = (req, res) => {

}