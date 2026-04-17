const express = require("express");
const {
  createIssue,
  getIssues,
  updateIssueStatus,
  joinIssue,
} = require("../controllers/issueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/issue", protect, createIssue);
router.get("/issues", protect, getIssues);
router.patch("/issue/:id", protect, updateIssueStatus);
router.post("/issue/:id/join", protect, joinIssue);

module.exports = router;
