const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("./utils/jwt");

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

    const token = generateToken(user);

    // user is authenticated
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
