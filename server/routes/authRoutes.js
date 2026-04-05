const express = require('express');
const router = express.Router();
const { userSignup, userLogin, adminSignup, adminLogin, profile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/user/signup',  userSignup);
router.post('/user/login',   userLogin);
router.post('/admin/signup', adminSignup);
router.post('/admin/login',  adminLogin);
router.get('/profile',       authMiddleware, profile);

module.exports = router;
