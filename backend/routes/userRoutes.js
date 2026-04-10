const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUser,
  changePassword,
} = require("../controllers/userController");

router.get("/me", getUserProfile);
router.put("/update", updateUser);
router.put("/change-password", changePassword);

module.exports = router;
