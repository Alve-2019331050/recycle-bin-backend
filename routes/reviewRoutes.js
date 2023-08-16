const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/',reviewController.addReviewController);

module.exports = router;