const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");

const {
  discoverTeams,
} = require("../controllers/TeamDiscoveryController/discoverTeams");

// discovery
router.get("/teams", verifyJWT, discoverTeams);

module.exports = router;
