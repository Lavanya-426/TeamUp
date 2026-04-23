const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");

exports.verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email });

  if (!record) return { success: false, message: "OTP not found" };

  if (Date.now() > record.expiresAt)
    return { success: false, message: "OTP expired" };

  if (record.attempts >= 5)
    return { success: false, message: "Too many attempts" };

  const isValid = await bcrypt.compare(otp, record.otpHash);

  if (!isValid) {
    record.attempts += 1;
    await record.save();
    return { success: false, message: "Invalid OTP" };
  }

  // delete OTP after success
  await OTP.deleteOne({ email });

  return { success: true };
};
