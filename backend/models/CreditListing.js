const mongoose = require("mongoose");

const CreditListingSchema = new mongoose.Schema({
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  credits: Number,
  pricePerCredit: Number,
  projectType: { type: String },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("CreditListing", CreditListingSchema);
//to sell carbon credits