const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //401 unquthorised -auth failed
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // checking if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "password mismatch!" });
    }

    // user is authenticated
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
