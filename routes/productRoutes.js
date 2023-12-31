const express = require('express');
const productController = require('../controllers/productController');
const { upload } = require('../multer');

const router = express.Router();
//routes
router.post('/create-product', upload.single("photo"), productController.createProductController);

//change made to get approved product
router.get('/get-product/:status', productController.getProductController);
router.get('/get-filtered-product', productController.getFilteredProductController);

//change made to get approved product
router.get('/get-single-product/:slug', productController.getSingleProductController);

module.exports = router;