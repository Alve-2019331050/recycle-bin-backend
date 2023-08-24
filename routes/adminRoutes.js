const express = require('express');
const { getPendingProductController } = require('../controllers/adminController');
const router = express.Router();

// GET PENDING PRODUCTS || GET
router.get('/getPendingProduct/:status', getPendingProductController);



module.exports = router;