const express = require("express");
const router = express.Router();

router.post("/", createTeam);
router.get("/", getTeams);
router.get("/:id", getTeamDetails);
router.delete("/:id", deleteTeam);

router.get("/:id/members", getTeamMembers);
router.delete("/:id/members/:userId", deleteMember);
router.patch("/:id/members/:userId/role", makeUserAsAdmin);

module.exports = router;
