const express = require("express");
const { submitTopicProgress, getUserProgress, getLeaderboard } = require("../controllers/progressController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/leaderboard", getLeaderboard); // Public or protected depending on preference
router.post("/topic", protect, submitTopicProgress);
router.get("/", protect, getUserProgress);

module.exports = router;
