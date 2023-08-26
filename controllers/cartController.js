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
}

module.exports.getUserOrderController = (req, res) => {

}

module.exports.getAdminOrderController = (req, res) => {

}