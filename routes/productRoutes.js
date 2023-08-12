const express = require('express');
const productController  = require('../controllers/productController');
const {upload} = require('../multer');

const router = express.Router();
//routes
router.post('/create-product',upload.single("photo"),productController.createProductController);
router.get('/get-product',productController.getProductController);
router.get('/get-product/:slug',productController.getSingleProductController);

module.exports = router;