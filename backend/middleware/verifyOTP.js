const { verifyOTP } = require("../utils/otpHelper");

module.exports = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const result = await verifyOTP(email, otp);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    req.otpVerified = true;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
