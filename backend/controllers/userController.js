const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const updates = {
      name: req.body.name,
      mobile: req.body.mobile,
      degree: req.body.degree,
      school: req.body.school,
      branch: req.body.branch,
      specialization: req.body.specialization,
      year: req.body.year,
    };

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User Profile Updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
