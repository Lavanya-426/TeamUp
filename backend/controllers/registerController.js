const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwtUtil.js");

//register user
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      degree,
      school,
      branch,
      specialization,
      year,
    } = req.body;
    const email = req.email;
    //basic validation
    if (!name || !password)
      return res.status(422).json({ message: "Required fields missing" });

    if (!email.endsWith("@vitapstudent.ac.in")) {
      return res.status(400).json({
        message: "Only VIT-AP student emails are allowed",
      });
    }

    //checking for existing users
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "user already exists" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashed_password,
      degree,
      school,
      branch,
      specialization,
      year,
    });
    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
