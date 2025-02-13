const express = require('express');
const {handleUserSignUp,handleUserLogin,sendOTP,verifyOTP} = require('../controllers/signUp');

const router = express.Router();

router.post('/',handleUserSignUp);
router.post('/login',handleUserLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;