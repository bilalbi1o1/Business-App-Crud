const express = require('express');
const {handleUserSignUp,handleUserLogin,sendOTP,verifyOTP,forgotPassword,resetPassword} = require('../controllers/signUp');

const router = express.Router();

router.post('/',handleUserSignUp);
router.post('/login',handleUserLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;