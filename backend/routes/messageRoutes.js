const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const verifyJWT = require("../middleware/jwtVerifyingMiddleware");

router.get("/:teamId", verifyJWT, messageController.getTeamMessages);

module.exports = router;
