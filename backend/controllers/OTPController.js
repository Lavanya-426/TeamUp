const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const transporter = require("../config/mailer");
const { generateOTP } = require("../utils/otpGenerator");
const { verifyOTP } = require("../utils/otpHelper");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  try {
    let { email } = req.body;
    email = email.toLowerCase().trim();

    const existing = await OTP.findOne({ email });

    if (existing && Date.now() < existing.expiresAt - 4 * 60 * 1000) {
      return res.status(429).json({
        message: "Please wait before requesting OTP again",
      });
    }
    console.log("one");
    if (!email.endsWith("@vitapstudent.ac.in")) {
      return res.status(400).json({
        message: "Only VIT-AP emails allowed",
      });
    }
    console.log("two");
    const otp = await generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    console.log("otp generated");

    await OTP.findOneAndUpdate(
      { email },
      {
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
      },
      { upsert: true },
    );
    console.log("otp obj created");

    await transporter.sendMail({
      to: email,
      subject: "TeamUp Registration OTP",

      text: `Hey Student,

Your OTP to register on TeamUp is: ${otp}

This OTP is valid for 5 minutes.

If you didn’t request this, you can safely ignore this email.

— TeamUp`,
    });
    console.log("mail sent");
    if (process.env.NODE_ENV === "development") {
      console.log("OTP:", otp);
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtpController = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.toLowerCase().trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const result = await verifyOTP(email, otp);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const tempToken = jwt.sign(
      { email, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );

    res.json({
      message: "OTP verified",
      tempToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
