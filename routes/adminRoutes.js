const express = require('express');
const { getPendingProductController, updateProductStatus } = require('../controllers/adminController');
const router = express.Router();

// GET PENDING PRODUCTS || GET
router.get('/getPendingProduct/:status', getPendingProductController);

//UPDATE PRODUCT STATUS || PUT
router.put('/updateProductStatus/:id', updateProductStatus);

module.exports = router;