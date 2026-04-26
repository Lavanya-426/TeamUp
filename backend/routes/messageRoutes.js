const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/:teamId", messageController.getTeamMessages);

module.exports = router;
