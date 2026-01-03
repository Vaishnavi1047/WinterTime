const express = require("express");
const CreditListing = require("../models/CreditListing");
const EmissionsLog = require("../models/EmissionsLog");
const router = express.Router();

router.post("/buy/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const listing = await CreditListing.findById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    let emissionsLog = await EmissionsLog.findOne({ userId }).sort({ year: -1 });

    if (emissionsLog) {
      emissionsLog.calculatedEmissions += listing.credits;
      await emissionsLog.save();
    } else {
      // If no log exists, set default targetEmissions
      let previousLog = await EmissionsLog.findOne({ userId }).sort({ createdAt: -1 });
      let previousTarget = previousLog?.targetEmissions || 51000;

      emissionsLog = await EmissionsLog.create({
        userId,
        year: new Date().getFullYear(),
        inputs: { electricityGrid: 0, coalThermal: 0, diesel: 0 },
        calculatedEmissions: listing.credits,
        targetEmissions: previousTarget,
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      message: "Purchase successful",
      purchasedCredits: listing.credits,
      updatedEmissions: emissionsLog.calculatedEmissions,
      targetEmissions: emissionsLog.targetEmissions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
