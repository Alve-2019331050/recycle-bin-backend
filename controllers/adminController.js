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