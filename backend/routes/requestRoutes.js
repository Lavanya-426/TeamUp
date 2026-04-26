const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/jwtVerifyingMiddleware.js");
const requireAdmin = require("../middleware/roleMiddleware");
const checkProjectConstraint = require("../middleware/checkProjectConstraints");

// controllers
const {
  viewReceivedRequests,
  viewSentRequests,
} = require("../controllers/RequestControllers/globalRequests");

const {
  sendRequest,
  withdrawRequest,
  getAllRequests,
} = require("../controllers/RequestControllers/teamSpecificRequestController");

const {
  approveRequest,
  rejectRequest,
} = require("../controllers/RequestControllers/requestActions");

// GLOBAL
router.get("/received", verifyJWT, viewReceivedRequests);
router.get("/sent", verifyJWT, viewSentRequests);

// TEAM-SPECIFIC
router.post("/:teamId", verifyJWT, checkProjectConstraint("send"), sendRequest);
router.delete("/:teamId", verifyJWT, withdrawRequest);
//router.get("/:teamId/me", verifyJWT, getRequestStatus);

router.get("/:teamId", verifyJWT, requireAdmin("teamId"), getAllRequests);

// ACTIONS
router.post(
  "/:teamId/:requestId/approve",
  verifyJWT,
  requireAdmin("teamId"),
  checkProjectConstraint("approve"),
  approveRequest,
);

router.post(
  "/:teamId/:requestId/reject",
  verifyJWT,
  requireAdmin("teamId"),
  rejectRequest,
);

module.exports = router;
