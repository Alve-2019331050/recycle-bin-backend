const categoryController = require('../controllers/categoryController');

const express = require('express');

const router = express.Router();

//routes
//create
router.post('/create-category',categoryController.createCategoryController);

//get all categories
router.get('/allcategories',categoryController.getCategoriesController);

//single category
router.get('/single-category/:slug',categoryController.singleCategoryController);

module.exports = router;