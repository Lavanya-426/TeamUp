const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");

const {
  discoverTeams,
} = require("../controllers/TeamDiscoveryController/discoverTeams");

// discovery
router.get("/teams", verifyJWT, discoverTeams);

module.exports = router;
