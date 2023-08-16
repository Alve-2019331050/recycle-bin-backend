const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();
//addToCart
router.post('/addItem',cartController.addController);
//getCartItems
router.get('/getItems',cartController.getItems);
//deleteItem
router.delete('/remove',cartController.deleteItem);
module.exports = router;