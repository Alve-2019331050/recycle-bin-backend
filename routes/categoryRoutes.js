createCategoryController = require('../controllers/categoryController');
getCategoriesController = require('../controllers/categoryController');
singleCategoryController = require('../controllers/categoryController');

const express = require('express');

const router = express.Router();

//routes
//create
router.post('/create-category',createCategoryController);

//get all categories
router.get('/allcategories',getCategoriesController);

//single category
router.get('/single-category/:slug',singleCategoryController);

module.exports = router;