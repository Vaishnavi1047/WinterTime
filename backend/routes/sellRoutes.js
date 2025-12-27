const express = require("express");
const router = express.Router();
const { sellCredits } = require("../controllers/sellController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

// Only OFFSET_DEVELOPER can sell
router.post("/sell", authenticate, requireRole("OFFSET_DEVELOPER"), sellCredits);

module.exports = router;
