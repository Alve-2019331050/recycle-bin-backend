const connection = require('../database');
const path = require('path');

// GET PENDING PRODUCT controller || GET
exports.getPendingProductController = (req, res) => {
    try {
        const sql = 'select * from product where status = ?';
        connection.query(sql, [req.params.status], (err, product) => {
            if (err) {
                return res.status(501).send({
                    success: false,
                    message: 'Error in getting pending products',
                    err
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: 'Pending product fetched',
                    product
                });
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: true,
            message: 'Error in getting pending products',
            error: error.message
        })
    }
};


//UPDATE PRODUCT STATUS || PUT
exports.updateProductStatus = (req, res) => {
    const productId = req.params.id;
    const newStatus = req.body.status;

    const sql = 'Update product SET status = ? WHERE p_id = ?';

    connection.query(sql, [newStatus, productId], (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error in updating product status',
                error: err
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Product status updated successfully.'
        })
    })
}