const express = require("express");
const router = express.Router();
const { getPendingSellRequests, updateSellRequestStatus, getApprovedListings } = require("../controllers/adminController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

// Admin only: view all pending sell requests
router.get("/pending-sell-requests", authenticate, requireRole("VERIFIER"), getPendingSellRequests);
// Admin only: approve/reject a sell request
router.patch("/sell-request/:id", authenticate, requireRole("VERIFIER"), updateSellRequestStatus);
// Public: get all approved listings for market
router.get("/market-listings", getApprovedListings);

module.exports = router;
