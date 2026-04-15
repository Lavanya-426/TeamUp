const express = require("express");
const router = express.Router();
const checkProjectConstraint = require("../middleware/checkProjectConstraint");
const {
  createTeam,
  deleteTeam,
  updateTeam,
} = require("../controllers/TeamManagementControllers/teamAdminControllers.js");

const {
  getTeamDetails,
  getTeamMembers,
} = require("../controllers/TeamManagementControllers/teamMemberAccessible.js");

const {
  getAdminTeams,
  getMemberTeams,
} = require("../controllers/TeamManagementControllers/gteTeamsController.js");
router.post("/", verifyJWT, createTeam);

router.get("/admin", verifyJWT, getAdminTeams);
router.get("/member", verifyJWT, getMemberTeams);

router.get("/:id", getTeamDetails);
router.get("/:id/members", getTeamMembers);

router.patch("/:id", verifyJWT, requireAdmin("id"), updateTeam);
router.delete("/:id", verifyJWT, requireAdmin("id"), deleteTeam);

router.patch(
  "/:id/members/:userId/role",
  verifyJWT,
  requireAdmin("id"),
  updateRole,
);

module.exports = router;
