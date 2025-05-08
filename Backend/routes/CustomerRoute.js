const { login, signup, startOTPVerification} = require("../controllers/CustomerController");
const express = require("express");
const router = express.Router();
router.post("/start-otp-verification",startOTPVerification)
router.post("/signup", signup);
router.post('/login', login);


module.exports = router;