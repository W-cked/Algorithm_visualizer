const express = require("express");
const { saveState, getState } = require("../controllers/shareController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Optional auth for saving (can remove 'protect' if you want anonymous sharing)
// If we want anonymous sharing but want to link to a user IF they are logged in, we'd need a custom middleware. 
// For now, let's keep it protected so only users can share, or remove 'protect' and let the controller handle it.
// Actually, let's make a lenient middleware or just remove protect for saving, the controller already handles req.user optionally.
// But wait, our authMiddleware blocks if no token. Let's just remove protect for now.
router.post("/", saveState); 
router.get("/:shortId", getState);

module.exports = router;
