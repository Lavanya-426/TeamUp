// Generate a numeric OTP of given length (default 6)
const crypto = require("crypto");

function generateOTP(length = 6) {
  console.log("in opt gen");
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, chars.length);
    otp += chars[index];
  }
  console.log("done otp gen");

  return otp;
}
module.exports = { generateOTP };
