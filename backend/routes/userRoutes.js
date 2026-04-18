const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUser,
  changePassword,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");

router.get("/me", verifyJWT, getUserProfile);
router.put("/update", verifyJWT, updateUser);
router.put("/change-password", verifyJWT, changePassword);

module.exports = router;
