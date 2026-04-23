const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/registerController");
const { loginUser } = require("../controllers/loginController");
const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");
const verifyOTP = require("../middleware/verifyOTP");

const {
  sendOtp,
  verifyOtpController,
} = require("../controllers/OTPController.js");
const verifyOTPToken = require("../middleware/verifyOTPToken.js");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpController);
router.post("/register", verifyOTPToken, registerUser);
router.post("/login", loginUser);

module.exports = router;
