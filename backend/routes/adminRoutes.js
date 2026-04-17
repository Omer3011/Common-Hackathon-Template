const express = require("express");
const { assignIssue, getAnalytics } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.patch("/assign/:id", protect, admin, assignIssue);
router.get("/analytics", protect, admin, getAnalytics);

module.exports = router;
