const express = require("express");
const router = express.Router();
const checkProjectConstraint = require("../middleware/checkProjectConstraints");

const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");
const requireAdmin = require("../middleware/roleMiddleware.js");
const buildScope = require("../utils/scopeBuilder.js");
const {
  createTeam,
  deleteTeam,
  updateTeam,
} = require("../controllers/TeamManagementControllers/teamAdminControls.js");

const {
  getTeamDetails,
  getTeamMembers,
} = require("../controllers/TeamManagementControllers/teamMemberAccessible.js");

const {
  getAllTeams,
  getAdminTeams,
  getMemberTeams,
} = require("../controllers/TeamManagementControllers/getTeamsController.js");

router.post("/", verifyJWT, buildScope, createTeam);
router.get("/", verifyJWT, getAllTeams);
router.get("/admin", verifyJWT, getAdminTeams);
router.get("/member", verifyJWT, getMemberTeams);

router.get("/:id", getTeamDetails);
router.get("/:id/members", getTeamMembers);

router.patch("/:id", verifyJWT, requireAdmin("id"), updateTeam);
router.delete("/:id", verifyJWT, requireAdmin("id"), deleteTeam);

module.exports = router;
