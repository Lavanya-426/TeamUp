const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");
const requireAdmin = require("../middleware/requireAdmin");

// global routes

const {
  viewReceivedRequests,
  viewSentRequests,
} = require("../controllers/RequestControllers/globalRequests.js");

router.get("/received", verifyJWT, viewReceivedRequests);
router.get("/sent", verifyJWT, viewSentRequests);

// team-specific

const {
  sendRequest,
  withdrawRequest,
  getRequestStatus,
  getAllRequests,
} = require("../controllers/RequestControllers/teamSpecificRequestController.js");
router.post("/:teamId", verifyJWT, sendRequest);
router.delete("/:teamId", verifyJWT, withdrawRequest);
router.get("/:teamId/me", verifyJWT, getRequestStatus);
router.get("/:teamId", verifyJWT, getAllRequests);

// actions

const {
  approveRequest,
  rejectRequest,
} = require("../controllers/RequestControllers/requestActions.js");
router.post(
  "/:requestId/approve",
  verifyJWT,
  requireAdmin("teamId"),
  approveRequest,
);
router.post("/:requestId/reject", verifyJWT, rejectRequest);

module.exports = router;
