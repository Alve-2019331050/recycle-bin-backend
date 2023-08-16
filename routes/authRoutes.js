const express = require('express');
const authController = require('../controllers/authController');
const { upload } = require('../multer');

const router = express.Router();

//register
router.post('/register',upload.single("avatar"),authController.registerController);
//login
router.post('/login',authController.loginController);
//logout
router.get('/logout',authController.logoutController);
//getUserInfo
router.get('/user-info/:u_id',authController.userInfoController);

module.exports = router;