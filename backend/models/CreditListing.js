const mongoose = require("mongoose");

const CreditListingSchema = new mongoose.Schema({
  developerId: mongoose.Schema.Types.ObjectId,
  credits: Number,
  pricePerCredit: Number,
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("CreditListing", CreditListingSchema);
//to sell carbon credits