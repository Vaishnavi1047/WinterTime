const CreditListing = require("../models/CreditListing");
const User = require("../models/User");

// Get all pending sell requests (admin only)
exports.getPendingSellRequests = async (req, res) => {
  try {
    const pending = await CreditListing.find({ status: "PENDING" }).populate('developerId', 'companyName email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching pending requests." });
  }
};

// Approve or reject a sell request (admin only)
exports.updateSellRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status: "APPROVED" or "REJECTED"
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const listing = await CreditListing.findByIdAndUpdate(id, { status }, { new: true });
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Server error updating status." });
  }
};

// Get all approved listings for market
exports.getApprovedListings = async (req, res) => {
  try {
    const listings = await CreditListing.find({ status: "APPROVED" }).populate('developerId', 'companyName');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching listings." });
  }
};
