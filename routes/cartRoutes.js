const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();
//addToCart
router.post('/addItem', cartController.addController);
//getCartItems
router.get('/getItems', cartController.getItems);
//deleteItem
router.delete('/remove', cartController.deleteItem);

//GET USER ORDER || GET
router.get('/userorder/:user_id', cartController.getUserOrderController);

//GET ADMIN ORDER || GET
router.get('/adminorder', cartController.getAdminOrderController);
module.exports = router;