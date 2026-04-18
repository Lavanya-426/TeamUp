const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/registerController");
const { loginUser } = require("../controllers/loginController");
const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
