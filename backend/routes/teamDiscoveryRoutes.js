const express = require("express");
const router = express.Router();
const buildScope = require("../utils/scopeBuilder.js");

const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");

const {
  discoverTeams,
} = require("../controllers/TeamDiscoveryController/discoverTeams");

// discovery
router.post("/teams", verifyJWT, buildScope, discoverTeams);

module.exports = router;
